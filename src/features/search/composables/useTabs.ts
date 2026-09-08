import {computed, ref} from "vue";
import {useTabsStore} from "@/store/tabs";

export const SEARCH_TAB_ID = 0
export const HISTORY_TAB_ID = 1
export const POPULAR_TAB_ID = 2

export function useTabs() {
    const store = useTabsStore()

    const tabs = ref([{id: HISTORY_TAB_ID, label: 'История'}, {id: POPULAR_TAB_ID, label: 'Популярное'}])
    const activeTabId = computed(() => store.tabId)

    const createSearchTab = (query: string) => {
        query = `'${capitalizeText(query)}'`
        tabs.value = tabs.value.filter(tab => tab.id != SEARCH_TAB_ID)
        tabs.value.unshift({id: SEARCH_TAB_ID, label: query})
    }

    const activateTabById = (id: number) => {
        store.saveTabId(id)
    }

    const initTabs = () => {
        store.hydrateTabId()
    }

    function capitalizeText(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }


    return {
        tabs,
        activeTabId,
        createSearchTab,
        activateTabById,
        initTabs
    }

}