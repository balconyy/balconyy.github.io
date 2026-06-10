import {computed, ref} from "vue";
import {capitalizeText} from '@/utils/strings'
import {useTabsStore} from "../../../store/tabs";

export const SEARCH_TAB_ID = 0
export const HISTORY_TAB_ID = 1

export function useTabs() {
    const store = useTabsStore()

    const tabs = ref([{id: HISTORY_TAB_ID, label: 'История'}])
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


    return {
        tabs,
        activeTabId,
        createSearchTab,
        activateTabById,
        initTabs
    }

}