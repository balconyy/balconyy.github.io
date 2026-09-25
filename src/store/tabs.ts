import {defineStore} from 'pinia'
import {TabId} from '@/models/tabs'

export const useTabsStore = defineStore('main_tabs', {
    state: () => ({
        tabId: TabId.Popular as number
    }),

    actions: {
        saveTabId(tabId: number) {
            this.tabId = tabId
            localStorage.setItem('tab_cache', String(tabId))
        },
        hydrateTabId() {
            const cachedId = localStorage.getItem('tab_cache')
            if (cachedId) {
                this.tabId = Number(cachedId)
            }
        },
    },
})