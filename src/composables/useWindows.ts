import {computed} from "vue";
import {useWindowsStore, WindowsSetting} from "@/store/windows";

export function useWindows() {

    const windowsStore = useWindowsStore()

    const isAuthOpen = computed(() => windowsStore.isAuthOpen)
    const isJokeOpen = computed(() => windowsStore.isJokeOpen)
    const isChatOpen = computed(() => windowsStore.isChatOpen)

    const windowsSetting = computed(() => windowsStore.windowsSetting)

    function initWindows() {
        windowsStore.hydrateWindows()
    }

    function toggleAuthWindow() {
        windowsStore.toggleAuthState()
    }

    function toggleJokeWindow() {
        windowsStore.toggleJokeState()
    }

    function toggleChatWindow() {
        windowsStore.toggleChatState()
    }

    function saveWindowsSetting(setting: WindowsSetting) {
        windowsStore.setWindowsSetting(setting)
    }

    return {
        isAuthOpen,
        isJokeOpen,
        isChatOpen,
        windowsSetting,
        initWindows,
        toggleAuthWindow,
        toggleJokeWindow,
        toggleChatWindow,
        saveWindowsSetting
    }
}