import {computed, type ComputedRef, ref, type Ref, type WritableComputedRef} from 'vue'
import {AspectRatio} from "@/models/playerModels";


const aspectRatios: AspectRatio[] = ['16:9', '12:5', '4:3']
const THEATER_MODE_BODY_CLASS = 'theater-mode-active'

const getViewportPlayerHeight = (): number => {
    if (typeof window === 'undefined') return 720
    return window.innerHeight * (window.innerWidth < 700 ? 0.6 : 0.985)
}

interface StyleObject {
    [key: string]: string
}
export const usePlayerLayout = (
    containerRef: Ref<HTMLElement | null>
) => {
    const theaterMode = ref(false)
    const closeButtonVisible = ref(false)
    const closeButtonWasVisible = ref(false)
    const theaterModeCloseButtonTimeout = ref<ReturnType<typeof setTimeout> | null>(null)
    const maxPlayerHeightValue = ref(getViewportPlayerHeight())
    const theaterFullscreenActive = ref(false)

    const maxPlayerHeight = computed(() => `${maxPlayerHeightValue.value}px`)

    const aspectRatio = ref<AspectRatio>('16:9')

    const updateScaleFactor = (): void => {
        if (theaterMode.value || !containerRef.value) return
        maxPlayerHeightValue.value = getViewportPlayerHeight()
    }

    const containerStyle = computed<StyleObject>(() => {
        const [w, h] = aspectRatio.value.split(':').map(Number)
        const maxWidth = maxPlayerHeightValue.value * (w / h)
        return {
            width: '100%',
            maxWidth: `${maxWidth}px`,
            maxHeight: maxPlayerHeight.value,
            margin: '0 auto',
            overflow: 'hidden'
        }
    })

    const iframeWrapperStyle = computed<StyleObject>(() => {
        const [w, h] = aspectRatio.value.split(':').map(Number)
        return {
            position: 'relative',
            width: '100%',
            paddingTop: `${(h / w) * 100}%`
        }
    })

    const showCloseButton = (): void => {
        if (theaterModeCloseButtonTimeout.value) {
            clearTimeout(theaterModeCloseButtonTimeout.value)
        }

        closeButtonWasVisible.value = true
        closeButtonVisible.value = true
        theaterModeCloseButtonTimeout.value = setTimeout(() => {
            closeButtonVisible.value = false
            theaterModeCloseButtonTimeout.value = null
        }, 4000)
    }

    const requestTheaterFullscreen = async (): Promise<void> => {
        try {
            if (!document.fullscreenElement && containerRef.value?.requestFullscreen) {
                await containerRef.value.requestFullscreen()
                theaterFullscreenActive.value = true
            }
        } catch {
            theaterFullscreenActive.value = false
        }
    }

    const lockMobileLandscape = async (): Promise<void> => {

        try {
            await (window.screen?.orientation as unknown as {
                lock?: (o: string) => Promise<void>
            })?.lock?.('landscape')
        } catch {
            // Browser support is inconsistent; theater mode should still work without orientation lock.
        }
    }

    const unlockMobileLandscape = (): void => {
        try {
            window.screen?.orientation?.unlock?.()
        } catch {
            // Some browsers expose orientation but reject unlock outside fullscreen.
        }
    }

    const exitTheaterFullscreen = async (): Promise<void> => {
        if (
            theaterFullscreenActive.value &&
            typeof document !== 'undefined' &&
            document.fullscreenElement &&
            document.exitFullscreen
        ) {
            try {
                await document.exitFullscreen()
            } catch {
                // Leaving theater mode must not depend on fullscreen API support.
            }
        }

        theaterFullscreenActive.value = false
    }

    const resetTheaterModeUi = (): void => {
        window.removeEventListener('mousemove', showCloseButton)
        document.removeEventListener('keydown', onKeyDown)
        document.removeEventListener('fullscreenchange', onFullscreenChange)
        document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
        document.body.classList.remove('no-scroll')
        document.body.classList.remove(THEATER_MODE_BODY_CLASS)
        unlockMobileLandscape()

        if (theaterModeCloseButtonTimeout.value) {
            clearTimeout(theaterModeCloseButtonTimeout.value)
            theaterModeCloseButtonTimeout.value = null
        }

        closeButtonVisible.value = false
    }

    const toggleTheaterMode = (): void => {
        // Fix: SSR guard — window/document are not available during server-side rendering
        if (typeof window === 'undefined' || typeof document === 'undefined') return

        theaterMode.value = !theaterMode.value
        if (theaterMode.value) {
            window.addEventListener('mousemove', showCloseButton)
            document.addEventListener('keydown', onKeyDown)
            document.addEventListener('fullscreenchange', onFullscreenChange)
            document.addEventListener('webkitfullscreenchange', onFullscreenChange)
            document.body.classList.add('no-scroll')
            document.body.classList.add(THEATER_MODE_BODY_CLASS)
            requestTheaterFullscreen().then(lockMobileLandscape)

            showCloseButton()
        } else {
            resetTheaterModeUi()
            exitTheaterFullscreen()
        }
    }

    function onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape' && theaterMode.value) {
            toggleTheaterMode()
        } else if (event.altKey && event.keyCode === 84) {
            toggleTheaterMode()
        }
    }

    function onFullscreenChange(): void {
        if (!theaterMode.value || !theaterFullscreenActive.value) return
        if (document.fullscreenElement || (document as unknown as {
            webkitFullscreenElement?: Element
        }).webkitFullscreenElement) return

        theaterFullscreenActive.value = false
        theaterMode.value = false
        resetTheaterModeUi()
    }

    const setAspectRatio = (ratio: AspectRatio): void => {
        aspectRatio.value = ratio
    }

    const cycleAspectRatio = (): void => {
        const currentIndex = aspectRatios.indexOf(aspectRatio.value)
        const nextIndex = (currentIndex + 1) % aspectRatios.length
        setAspectRatio(aspectRatios[nextIndex])
    }

    const cleanupPlayerLayout = (): void => {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            resetTheaterModeUi()
        }
        exitTheaterFullscreen()

        if (theaterModeCloseButtonTimeout.value) {
            clearTimeout(theaterModeCloseButtonTimeout.value)
            theaterModeCloseButtonTimeout.value = null
        }
    }

    return {
        theaterMode,
        closeButtonVisible,
        closeButtonWasVisible,
        aspectRatio,
        containerStyle,
        iframeWrapperStyle,
        aspectRatios,
        updateScaleFactor,
        toggleTheaterMode,
        setAspectRatio,
        cycleAspectRatio,
        cleanupPlayerLayout
    }
}