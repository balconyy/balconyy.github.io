import {defineStore} from "pinia";

export const useWindowsStore = defineStore('windows', {
    state: () => ({
        isAuthOpen: null as boolean | null,
        isChatOpen: null as boolean | null,
    }),

    actions: {
        toggleAuthState() {
            this.isAuthOpen = !this.isAuthOpen;
            sessionStorage.setItem('auth_window', String(this.isAuthOpen))
        },
        toggleChatState() {
            this.isChatOpen = !this.isChatOpen;
            sessionStorage.setItem('chat_window', String(this.isChatOpen))
        },

        hydrateWindows() {
            const cachedAuth = sessionStorage.getItem('auth_window')
            this.isAuthOpen = cachedAuth != 'false';
            const cachedChat = sessionStorage.getItem('chat_window')
            this.isChatOpen = cachedChat != 'false';
        },
    },
})