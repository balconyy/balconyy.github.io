import {ref, watch, type Ref} from 'vue'

/**
 * Состояние загрузки медиа-элемента, общее для iframe и video.
 *
 * Различает два сценария:
 *  - сменился mediaId (другой ролик / другой плеер) — элемент
 *    пересоздаётся по mediaKey, кадр прячется, показывается спиннер;
 *  - сменился только url при том же mediaId (смена качества) — элемент
 *    остаётся живым, кадр не прячем, показываем ненавязчивый индикатор.
 */
export function useMediaLoadingState(
    mediaUrl: Ref<string | null | undefined>,
    mediaId: Ref<string | null | undefined>
) {
    const isMediaLoading = ref(true)
    const isMediaSwitching = ref(false)
    const mediaKey = ref(0)

    watch(mediaId, () => {
        isMediaLoading.value = true
        isMediaSwitching.value = false

        // Костыль для не попадания iframe/video в backstack браузера
        // и чтобы точно форсировать перезапрос нового src
        mediaKey.value++
    })

    watch(mediaUrl, (newUrl, oldUrl) => {
        if (!newUrl) {
            // Пустой url — тоже ожидание: источник выбирается или тянет ссылки.
            isMediaLoading.value = true
            isMediaSwitching.value = false
            return
        }

        if (oldUrl && !isMediaLoading.value) {
            isMediaSwitching.value = true
            return
        }

        isMediaLoading.value = true
    })

    const onMediaLoaded = (): void => {
        isMediaLoading.value = false
        isMediaSwitching.value = false
    }

    return {
        isMediaLoading,
        isMediaSwitching,
        mediaKey,
        onMediaLoaded
    }
}