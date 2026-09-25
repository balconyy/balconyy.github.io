import {computed, ref} from "vue";
import {useTabsStore} from "@/store/tabs";
import {TabId, type Tab} from "@/models/tabs";

const DEFAULT_TABS: Tab[] = [
    {id: TabId.History, label: "История"},
    {id: TabId.Vods, label: "VODы"},
    {id: TabId.Popular, label: "Популярное"},
]

export function useTabs() {
    const store = useTabsStore()

    function capitalize(text: string): string {
        if (!text) return text
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    }

    function buildSearchTab(query: string): Tab {
        return {id: TabId.Search, label: `'${capitalize(query)}'`}
    }


    const tabs = ref<Tab[]>([...DEFAULT_TABS])

    // Search-таб живёт только в рамках текущей сессии страницы:
    // не пишем его в store, чтобы после reload активным снова стал
    // персистентный таб (History/Popular), а не Search.
    const sessionTabId = ref<TabId | null>(null)
    const activeTabId = computed<TabId>(() => sessionTabId.value ?? store.tabId)

    const setSearchTab = (query: string) => {
        const withoutSearch = tabs.value.filter(tab => tab.id !== TabId.Search)
        tabs.value = [buildSearchTab(query), ...withoutSearch]
    }

    const clearSearchTab = () => {
        tabs.value = tabs.value.filter(tab => tab.id !== TabId.Search)
        if (sessionTabId.value === TabId.Search) {
            sessionTabId.value = null
        }
    }

    const activateTab = (id: TabId) => {
        if (id === TabId.Search) {
            sessionTabId.value = id
        } else {
            sessionTabId.value = null
            store.saveTabId(id)
        }
    }

    const initTabs = () => {
        store.hydrateTabId()
    }

    return {
        tabs,
        activeTabId,
        setSearchTab,
        clearSearchTab,
        activateTab,
        initTabs,
    }
}