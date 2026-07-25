import {computed, ref, watch} from "vue";
import {useRemoteConfigStore} from "@/store/remoteConfig";
import {useDailyStore} from "@/store/dailyJoke";

export function useDailyWindow() {

    const configStore = useRemoteConfigStore();
    const dailyStore = useDailyStore()


    const dailyJokeUrl = ref<string | null>(null)
    const minHeight = ref<number | null>(null)

    const isOpen = computed(() => dailyStore.isOpen)
    const currentHeight = computed(() => dailyStore.screenHeight)

    const dailyJokeConfig = computed(() => configStore.remoteConfig?.dailyJoke)
    watch(
        dailyJokeConfig,
        (config) => {
            if (!config) return

            dailyJokeUrl.value = config.url
            minHeight.value = config.height

            if (currentHeight.value === null) {
                setWindowHeight(config.height)
            }
        },
        {immediate: true}
    )

    function initDailyScreen() {
        dailyStore.hydrateDailyScreen()
    }

    function toggleWindowState() {
        dailyStore.toggleWindowState()
    }

    function setWindowHeight(height: number) {
        dailyStore.setCurrentHeight(height)
    }


    return {
        dailyJokeUrl,
        minHeight,
        currentHeight,
        isOpen,
        initDailyScreen,
        toggleWindowState,
        setWindowHeight
    }
}