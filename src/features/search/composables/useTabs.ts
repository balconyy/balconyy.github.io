import { ref} from "vue";
import {capitalizeText} from '@/utils/strings'

export const SEARCH_TAB_ID = 0
export const HISTORY_TAB_ID = 1

export function useTabs() {


    const tabs = ref([{id: HISTORY_TAB_ID, label: 'История'}])
    const activeTabId = ref<number>(HISTORY_TAB_ID)

    const openSearchTab = (query: string) => {
        query = `'${capitalizeText(query)}'`
        tabs.value = tabs.value.filter(tab => tab.id != SEARCH_TAB_ID)
        tabs.value.unshift({id: SEARCH_TAB_ID, label: query})
        activeTabId.value = SEARCH_TAB_ID
    }


    return {
        tabs,
        activeTabId,
        openSearchTab
    }

}