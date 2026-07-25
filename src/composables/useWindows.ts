import {computed} from "vue";
import {useWindowsStore} from "@/store/windows";

export function useWindows() {

    const windowsStore = useWindowsStore()

    const isAuthOpen = computed(() => windowsStore.isAuthOpen)
    const isChatOpen = computed(() => windowsStore.isChatOpen)

    function initWindows() {
        windowsStore.hydrateWindows()
    }

    function toggleAuthWindow() {
        windowsStore.toggleAuthState()
    }

    function toggleChatWindow() {
        windowsStore.toggleChatState()
    }

    return {
        isAuthOpen,
        isChatOpen,
        initWindows,
        toggleAuthWindow,
        toggleChatWindow
    }
}