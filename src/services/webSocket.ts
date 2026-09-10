import {WebSocketEvent} from "@/models/websocket";

const BASE_DELAY_MS = 2000
const MAX_DELAY_MS = 10000

type EventListener<T extends WebSocketEvent['type'] = WebSocketEvent['type']> =
    (event: Extract<WebSocketEvent, { type: T }>) => void

type ConnectionListener = (connected: boolean) => void

interface Channel {
    socket: WebSocket | null
    reconnectTimer: number | null
    reconnectAttempt: number
    connectionId: number
    closedIntentionally: boolean
}


const channels = new Map<string, Channel>()

const eventListeners = new Map<WebSocketEvent['type'], Set<EventListener>>()

const connectionListeners = new Map<string, Set<ConnectionListener>>()

function channelKey(room?: string): string {
    return room ?? '__default__'
}

function getOrCreateChannel(key: string): Channel {
    let channel = channels.get(key)
    if (!channel) {
        channel = {
            socket: null,
            reconnectTimer: null,
            reconnectAttempt: 0,
            connectionId: 0,
            closedIntentionally: false,
        }
        channels.set(key, channel)
    }
    return channel
}

function nextDelay(channel: Channel): number {
    const delay = Math.min(BASE_DELAY_MS * 2 ** channel.reconnectAttempt, MAX_DELAY_MS)
    channel.reconnectAttempt++
    return delay
}

function buildUrl(room?: string): string {
    const base = `${import.meta.env.VITE_BACKEND_URL.replace('http', 'ws')}/chat/actual`
    return room ? `${base}?room=${encodeURIComponent(room)}` : base
}

function notifyConnection(key: string, connected: boolean) {
    connectionListeners.get(key)?.forEach(fn => fn(connected))
}

function dispatch(data: WebSocketEvent) {
    eventListeners.get(data.type)?.forEach(fn => (fn as EventListener)(data as any))
}

export function onWsEvent<T extends WebSocketEvent['type']>(
    type: T,
    handler: (event: Extract<WebSocketEvent, { type: T }>) => void
): () => void {
    if (!eventListeners.has(type)) eventListeners.set(type, new Set())
    eventListeners.get(type)!.add(handler as EventListener)
    return () => eventListeners.get(type)?.delete(handler as EventListener)
}

export function onWsConnectionChange(room: string | undefined, handler: ConnectionListener): () => void {
    const key = channelKey(room)
    if (!connectionListeners.has(key)) connectionListeners.set(key, new Set())
    connectionListeners.get(key)!.add(handler)
    return () => connectionListeners.get(key)?.delete(handler)
}

export function connectChatSocket(room?: string) {
    const key = channelKey(room)
    const channel = getOrCreateChannel(key)

    if (channel.socket && channel.socket.readyState <= WebSocket.OPEN) {
        return // для этой комнаты уже есть живое или устанавливаемое соединение
    }

    channel.closedIntentionally = false
    const myId = ++channel.connectionId // "паспорт" именно этого соединения

    const ws = new WebSocket(buildUrl(room))
    channel.socket = ws

    ws.onopen = () => {
        if (myId !== channel.connectionId) return // это уже устаревшее соединение
        channel.reconnectAttempt = 0
        notifyConnection(key, true)
    }

    ws.onmessage = (rawEvent) => {
        if (myId !== channel.connectionId) return
        let data: WebSocketEvent
        try {
            data = JSON.parse(rawEvent.data)
        } catch (e) {
            console.error('Не удалось распарсить WS-фрейм', e)
            return
        }
        dispatch(data)
    }

    ws.onclose = () => {
        if (myId !== channel.connectionId) return // старое соединение — просто игнорируем
        channel.socket = null
        notifyConnection(key, false)
        if (!channel.closedIntentionally) {
            channel.reconnectTimer = window.setTimeout(
                () => connectChatSocket(room),
                nextDelay(channel)
            )
        }
    }

    ws.onerror = () => ws.close()
}

export function disconnectChatSocket(room?: string) {
    const key = channelKey(room)
    const channel = channels.get(key)
    if (!channel) return

    channel.closedIntentionally = true
    channel.connectionId++

    if (channel.reconnectTimer) {
        clearTimeout(channel.reconnectTimer)
        channel.reconnectTimer = null
    }
    channel.reconnectAttempt = 0

    channel.socket?.close()
    channel.socket = null
    channels.delete(key)
    notifyConnection(key, false)
}