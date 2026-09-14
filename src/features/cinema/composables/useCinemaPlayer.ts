import {ref, onBeforeUnmount, toValue, type Ref, type MaybeRefOrGetter} from 'vue'


//Singleton

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

function safeNumber(raw: unknown): number | null {
    if (raw === undefined || raw === null || raw === '') return null
    const n = Number(raw)
    return Number.isNaN(n) ? null : n
}


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
        const origin = toValue(playerOrigin)
        if (origin && e.origin !== origin) return

        const payload = e.data as CinemaPlayerEvent
        if (!payload || typeof payload.event !== 'string') return

        switch (payload.event) {
            case 'inited':
                state.value.ready = true
                break
            case 'quality':
                if (payload.data !== undefined) state.value.quality = resolveQualityLabel(payload.data)
                break
            case 'duration': {
                const d = safeNumber(payload.duration)
                if (d !== null) state.value.duration = d
                break
            }
            case 'time': {
                const t = safeNumber(payload.data)
                if (t !== null) state.value.currentTime = t
                const d = safeNumber(payload.duration)
                if (d !== null) state.value.duration = d
                break
            }
            case 'seek':
            case 'rewound': {
                const t = safeNumber(payload.data)
                if (t !== null) state.value.currentTime = t
                break
            }
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
        state.value.volume = volume
        sendCommand('volume', volume)
    }

    function setQuality(index: QualityIndex | number) {
        sendCommand('quality', index)
    }

    function reset() {
        state.value.ready = false
        state.value.quality = null
        state.value.duration = 0
        state.value.currentTime = 0
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
        reset,
        attach,
        detach,
    }
}