import { defineStore } from 'pinia'
import { chatApi } from '@/data/api/chat'
import {Message} from "@/models/message";
import {onWsEvent, onWsConnectionChange} from '@/services/webSocket'

let initialized = false

export const useChatStore = defineStore('chat', {
    state: () => ({
        chat: [] as Message[],
        online: 0,        // дефолтный чат (scope === null)
        cinemaOnline: 0,  // комната cinema (scope === 'cinema')
        connected: false,
        isLoading: false,
        isSending: false,
    }),
    actions: {
        init() {
            if (initialized) return
            initialized = true

            onWsEvent('message', (event) => this.addMessage(event.message))
            onWsEvent('count', (event) => this.setOnline(event.count, event.scope))
            onWsConnectionChange(undefined, (connected) => this.setConnected(connected))
        },

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
            this.isSending = true
            try {
                await chatApi.sendMessage(text)
            } finally {
                this.isSending = false
            }
        },

        addMessage(message: Message) {
            this.chat.push(message)
        },
        setOnline(count: number, scope: string | null) {
            if (scope === 'cinema') {
                this.cinemaOnline = count
            } else {
                this.online = count
            }
        },
        setConnected(connected: boolean) {
            this.connected = connected
            if (!connected) {
                this.online = -1
                this.cinemaOnline = -1
            }
        },
    },
})