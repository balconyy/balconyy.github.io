import {computed, ref, watch, type Ref} from 'vue'

import {useVodPlayer} from '@/features/player/composables/useVodPlayer'
import type {StreamerVodDto} from '@/data/dto/vod/streamerVodDto'
import {PlayerSource} from "@/features/player/contract/playerSource";
import {definePlayerOverlay} from "@/features/player/contract/playerOverlay";
import VodMediaOverlay from "@/features/player/components/VodMediaOverlay.vue";
import VideoMedia from "@/features/player/components/VideoMedia.vue";

const NO_VODS_MESSAGE = 'Видео не найдены.'
const NO_VODS_LABEL = 'Источники не найдены'
const CHOOSE_LABEL = 'Выберите источник'
const LOADING_LABEL = 'Загрузка...'

const BOOSTY_POST_URL = (channel: string, postId: string): string =>
    `https://boosty.to/${channel}/posts/${postId}`

const vodKey = (vod: StreamerVodDto): string => `${vod.boostyChannel}:${vod.postId}`

const vodLabel = (vod: StreamerVodDto): string =>
    `${vod.streamerName} - ${new Date(vod.dateTimestamp).toLocaleDateString('ru-RU')}`

export function useVodPlayerSource(kpId: Ref<number | undefined>): PlayerSource {
    const core = useVodPlayer()

    const isActive = ref(false)
    let loadedKpId: number | null = null

    /**
     * Список тянется независимо от активности: без него нельзя ответить
     * на вопрос "показывать ли тумблер". Запрос идёт один раз на kpId.
     */
    const loadList = (): void => {
        const id = kpId.value
        if (!id || loadedKpId === id) return

        loadedKpId = id
        core.getAvailableVods(id)
    }

    watch(kpId, () => {
        loadedKpId = null
        core.resetSelection()
        loadList()
    })

    /**
     * Автовыбор первого ролика. Без него после переключения тумблера
     * плеер висел в загрузке, пока пользователь сам не откроет модалку.
     * Ссылки запрашиваем только когда источник активен — иначе фоновый
     * prefetch дёргал бы лишний запрос для невидимого плеера.
     */
    watch(
        [isActive, () => core.vodsList.value],
        () => {
            if (!isActive.value) return
            if (core.selectedVod.value || core.isPlayerLoading.value) return

            const first = core.vodsList.value[0]
            if (first) core.getPlayerLinks(first)
        },
        {immediate: true}
    )

    const selectedLabel = computed<string>(() => {
        if (core.selectedVod.value) return vodLabel(core.selectedVod.value)
        if (core.isListLoading.value) return LOADING_LABEL
        return core.vodsList.value.length === 0 ? NO_VODS_LABEL : CHOOSE_LABEL
    })

    /** Ссылка на оригинальный пост: из DTO, если бэк её отдал, иначе собираем. */
    const sourceUrl = computed<string | null>(() => {
        const vod = core.selectedVod.value
        if (!vod) return null

        return BOOSTY_POST_URL(vod.boostyChannel, vod.postId)
    })

    const overlay = computed(() => {
        if (!core.selectedVod.value) return null

        return definePlayerOverlay(
            VodMediaOverlay,
            {
                qualities: core.vodQualityList.value,
                currentQuality: core.currentQuality.value,
                sourceUrl: sourceUrl.value
            },
            {
                'change-quality': (quality: string) => core.setQuality(quality)
            } as never
        )
    })

    return {
        type: 'vod',
        mediaComponent: VideoMedia,

        items: computed(() =>
            core.vodsList.value.map(vod => ({key: vodKey(vod), label: vodLabel(vod)}))
        ),
        selectedKey: computed(() =>
            core.selectedVod.value ? vodKey(core.selectedVod.value) : null
        ),
        selectedLabel,

        isResolved: computed(() => core.isListLoaded.value && !core.isListLoading.value),
        isAvailable: computed(
            () => core.isListLoaded.value && !core.isListLoading.value && core.vodsList.value.length > 0
        ),

        // Идентичность — сам ролик, а не url: смена качества меняет url,
        // но mediaId остаётся прежним, поэтому <video> не пересоздаётся.
        mediaId: computed(() =>
            core.selectedVod.value ? vodKey(core.selectedVod.value) : null
        ),
        mediaUrl: computed(() => core.currentVodUrl.value),
        mediaLabel: computed(() =>
            core.selectedVod.value ? vodLabel(core.selectedVod.value) : ''
        ),
        loadingText: computed(() => {
            const label = core.selectedVod.value ? vodLabel(core.selectedVod.value) : ''
            return label ? `Загружается: ${label}` : LOADING_LABEL
        }),

        overlay,

        isLoading: computed(() => core.isListLoading.value || core.isPlayerLoading.value),
        emptyMessage: computed(() =>
            !core.isListLoading.value && core.vodsList.value.length === 0 ? NO_VODS_MESSAGE : ''
        ),
        errorMessage: computed(() => ''),
        errorCode: computed(() => null),

        select: (key: string): void => {
            const vod = core.vodsList.value.find(item => vodKey(item) === key)
            if (vod) core.getPlayerLinks(vod)
        },

        prefetch: (): void => loadList(),

        activate: (): void => {
            isActive.value = true
            loadList()
        },

        deactivate: (): void => {
            isActive.value = false
        }
    }
}