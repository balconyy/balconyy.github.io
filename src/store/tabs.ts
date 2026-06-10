import {defineStore} from "pinia";

export const useTabsStore = defineStore('main_tabs', {
    state: () => ({
        tabId: 1 as number
    }),

    actions: {
        saveTabId(tabId: number) {
            this.tabId = tabId
            sessionStorage.setItem('tab_cache', String(tabId))
        },
        hydrateTabId() {
            const cachedId = sessionStorage.getItem('tab_cache')
            if (cachedId) {
                this.tabId = Number(cachedId)
            }
        },
    },

})