import {useChatStore} from "@/store/chat";


let socket: WebSocket | null = null
let reconnectTimer: number | null = null
let isIntentionallyClosed = false

export function connectChatSocket() {
    if (socket && socket.readyState <= WebSocket.OPEN) return

    const store = useChatStore()
    isIntentionallyClosed = false
    socket = new WebSocket(`${import.meta.env.VITE_BACKEND_URL.replace('http', 'ws')}/chat/actual`)

    socket.onopen = () => { store.connected = true }
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.count) store.online = data.count
        else store.chat.push(data)
    }
    socket.onclose = () => {
        store.connected = false
        socket = null
        if (!isIntentionallyClosed) reconnectTimer = window.setTimeout(connectChatSocket, 2000)
    }
    socket.onerror = () => socket?.close()
}

export function disconnectChatSocket() {
    isIntentionallyClosed = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    socket?.close()
    socket = null
}