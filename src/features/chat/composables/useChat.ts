import {onUnmounted, ref} from "vue";
import {chatApi} from "@/data/api/chat";

export function useChat() {
    const isLoading = ref(false);
    const chat = ref<Message[]>([])
    const online = ref<number>(0)

    const connected = ref(false)
    let socket: WebSocket | null = null
    let reconnectTimer: number | null = null

    const getChatLogs = async () => {
        try {
            isLoading.value = true;
            const response = await chatApi.getMessages()
            chat.value = response.data
        } catch (e) {

        } finally {
            isLoading.value = false;
        }

    }

    const sendMessage = async (text: string) => {
        try {
            await chatApi.sendMessage(text)
        } catch (e) {

        }
    }

    function connectToChat() {
        socket = new WebSocket(`${import.meta.env.VITE_BACKEND_URL.replace('http', 'ws')}/chat/actual`)

        socket.onopen = () => {
            connected.value = true
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log(data)
            if (data.count) {
                online.value = data.count
            } else {
                chat.value.push(data as Message)
            }
        }

        socket.onclose = () => {
            connected.value = false
            reconnectTimer = window.setTimeout(connectToChat, 2000)
        }

        socket.onerror = () => {
            console.log("error")
            socket?.close()
        }
    }

    onUnmounted(() => {
        if (reconnectTimer) clearTimeout(reconnectTimer)
        socket?.close()
    })

    return {
        chat,
        online,
        isLoading,
        getChatLogs,
        sendMessage,
        connectToChat
    }
}