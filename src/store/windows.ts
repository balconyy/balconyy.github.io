import {defineStore} from "pinia";

export type WindowsSetting = {
    widthTop: number
    heightTop: number
    widthBottom: number
    heightBottom: number
}

export const useWindowsStore = defineStore('windows', {
    state: () => ({
        isAuthOpen: true,
        isJokeOpen: false,
        isChatOpen: false,
        windowsSetting: {
            widthTop: 320,
            heightTop: 200,
            widthBottom: 320,
            heightBottom: 200,
        } as WindowsSetting,
    }),

    actions: {
        toggleAuthState() {
            this.isAuthOpen = !this.isAuthOpen
            localStorage.setItem('auth_window', String(this.isAuthOpen))
        },

        toggleJokeState() {
            this.isJokeOpen = !this.isJokeOpen
            localStorage.setItem('joke_window', String(this.isJokeOpen))
        },

        toggleChatState() {
            this.isChatOpen = !this.isChatOpen
            localStorage.setItem('chat_window', String(this.isChatOpen))
        },

        setWindowsSetting(setting: WindowsSetting) {
            this.windowsSetting = setting
            localStorage.setItem(
                'window_setting',
                JSON.stringify(setting)
            )
        },

        hydrateWindows() {
            const cachedAuth = localStorage.getItem('auth_window')
            this.isAuthOpen = cachedAuth === null || cachedAuth === 'true'

            const cachedChat = localStorage.getItem('chat_window')
            this.isChatOpen = cachedChat === 'true'

            const cachedJoke = localStorage.getItem('joke_window')
            this.isJokeOpen = cachedJoke === 'true'

            const cachedSetting = localStorage.getItem('window_setting')
            if (cachedSetting) {
                try {
                    this.windowsSetting = JSON.parse(cachedSetting)
                } catch (e) {
                    console.log(e)
                }
            }
        },
    },

    persist: {
        storage: localStorage,
        pick: [
            'isAuthOpen',
            'isJokeOpen',
            'isChatOpen',
            'windowsSetting'
        ],
    },
})