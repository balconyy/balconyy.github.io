import {ref, onBeforeUnmount, toValue, type Ref, type MaybeRefOrGetter} from 'vue'


export const QUALITY_LEVELS = ['240p', '360p', '480p', '720p', '1080p'] as const
export type QualityLevel = typeof QUALITY_LEVELS[number]
export type QualityIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface CinemaPlayerEvent {
    event: 'init' | 'inited' | 'playlist' | 'volume' | 'quality' | 'duration' | 'time' | 'seek' | 'rewound' | string
    time: number
    data?: string | number
    duration?: number
    volume?: string
}

export interface CinemaPlayerState {
    ready: boolean
    volume: number
    quality: QualityLevel | string | null
    currentTime: number
    duration: number
}

type Listener = (event: CinemaPlayerEvent) => void

export function useCinemaPlayer(
    iframeRef: Ref<HTMLIFrameElement | null>,
    playerOrigin?: MaybeRefOrGetter<string | undefined>
) {
    const state = ref<CinemaPlayerState>({
        ready: false,
        volume: 1,
        quality: null,
        currentTime: 0,
        duration: 0,
    })

    const listeners = new Map<string, Set<Listener>>()

    function on(eventName: CinemaPlayerEvent['event'] | '*', handler: Listener) {
        if (!listeners.has(eventName)) listeners.set(eventName, new Set())
        listeners.get(eventName)!.add(handler)
        return () => listeners.get(eventName)?.delete(handler)
    }

    function handleMessage(e: MessageEvent) {
        const iframe = iframeRef.value
        if (!iframe || e.source !== iframe.contentWindow) return
        // если знаем origin плеера — сверяем и входящие сообщения тоже
        // (playerOrigin разворачиваем каждый раз, т.к. он может смениться вместе с src)
        const origin = toValue(playerOrigin)
        if (origin && e.origin !== origin) return

        const payload = e.data as CinemaPlayerEvent
        if (!payload || typeof payload.event !== 'string') return

        switch (payload.event) {
            case 'inited':
                state.value.ready = true
                break
            case 'volume':
                if (payload.volume !== undefined) state.value.volume = Number(payload.volume)
                break
            case 'quality':
                if (payload.data !== undefined) state.value.quality = resolveQualityLabel(payload.data)
                break
            case 'duration':
                if (payload.duration !== undefined) state.value.duration = payload.duration
                break
            case 'time':
                if (payload.data !== undefined) state.value.currentTime = Number(payload.data)
                if (payload.duration !== undefined) state.value.duration = payload.duration
                break
            case 'seek':
            case 'rewound':
                if (payload.data !== undefined) state.value.currentTime = Number(payload.data)
                break
        }

        listeners.get(payload.event)?.forEach((fn) => fn(payload))
        listeners.get('*')?.forEach((fn) => fn(payload))
    }

    function sendCommand(api: string, set?: unknown) {
        const iframe = iframeRef.value
        if (!iframe?.contentWindow) {
            console.warn('[cinemaPlayer] iframe ещё не смонтирован')
            return
        }
        const payload: Record<string, unknown> = {api}
        if (set !== undefined) payload.set = set
        iframe.contentWindow.postMessage(payload, '*')
    }

    function resolveQualityLabel(raw: string | number): string {
        const asIndex = Number(raw)
        if (!Number.isNaN(asIndex) && QUALITY_LEVELS[asIndex] !== undefined) {
            return QUALITY_LEVELS[asIndex]
        }
        return String(raw)
    }


    function play() {
        sendCommand('play')
    }

    function pause() {
        sendCommand('pause')
    }

    function seekTo(seconds: number) {
        sendCommand('seek', seconds)
    }

    function setVolume(volume: number) {
        const v = Math.min(1, Math.max(0, volume))
        sendCommand('volume', v)
    }

    function setQuality(index: QualityIndex | number) {
        sendCommand('quality', index)
    }

    function attach() {
        window.addEventListener('message', handleMessage)
    }

    function detach() {
        window.removeEventListener('message', handleMessage)
    }

    onBeforeUnmount(detach)

    return {
        state,
        on,
        play,
        pause,
        setVolume,
        setQuality,
        seekTo,
        attach,
        detach,
    }
}