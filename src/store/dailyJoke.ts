import {defineStore} from "pinia";

export const useDailyStore = defineStore('dailyScreen', {
    state: () => ({
        isOpen: null as boolean | null,
        screenHeight: null as number | null,
    }),

    actions: {
        toggleWindowState() {
            this.isOpen = !this.isOpen;
            sessionStorage.setItem('daily_screen', String(this.isOpen))
        },
        setCurrentHeight(height: number) {
            this.screenHeight = height
            sessionStorage.setItem('daily_height', String(height))
        },
        hydrateDailyScreen() {
            const cachedScreen = sessionStorage.getItem('daily_screen')
            this.isOpen = cachedScreen != 'false';
            const cachedHeight = sessionStorage.getItem('daily_height')
            if (cachedHeight) {
                this.screenHeight = Number(cachedHeight)
            }
        },
    },
})