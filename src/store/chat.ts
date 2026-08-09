import { defineStore } from 'pinia'
import { chatApi } from '@/data/api/chat'

export const useChatStore = defineStore('chat', {
    state: () => ({
        chat: [] as Message[],
        online: 0,
        connected: false,
        isLoading: false,
    }),
    actions: {
        async getChatLogs() {
            this.isLoading = true
            try {
                const response = await chatApi.getMessages()
                this.chat = response.data
            } finally {
                this.isLoading = false
            }
        },
        async sendMessage(text: string) {
            await chatApi.sendMessage(text)
        },
    },
})