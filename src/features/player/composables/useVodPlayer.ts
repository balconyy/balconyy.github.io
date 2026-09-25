import {computed, ref} from 'vue'

import {BoostyVodDto} from '@/data/dto/vod/boostyVodDto'
import {vodsApi} from '@/data/api/vods'
import {BoostyPostDto} from "@/data/dto/vod/boostyPostDto";

const FALLBACK_QUALITY = '720p'

const qualityWeight = (quality: string): number => {
    const digits = quality.match(/\d+/)
    return digits ? Number(digits[0]) : -1
}

const sortByQuality = (list: BoostyVodDto[]): BoostyVodDto[] =>
    [...list].sort((a, b) => qualityWeight(b.quality) - qualityWeight(a.quality))

export function useVodPlayer() {
    const isListLoading = ref(false)
    const isPlayerLoading = ref(false)
    const isListLoaded = ref(false)

    const postList = ref<BoostyPostDto[]>([])
    const vodQualityList = ref<BoostyVodDto[]>([])
    const selectedPost = ref<BoostyPostDto | null>(null)

    /**
     * Текущее качество — единственный стейт, url из него выводится.
     * Раньше currentVodUrl был ref и его пришлось бы синхронизировать
     * с качеством в двух местах.
     */
    const currentQuality = ref<string | null>(null)

    /** Качество, выбранное пользователем руками: переносим на следующие ролики. */
    const preferredQuality = ref<string | null>(null)

    const currentVodUrl = computed<string | null>(
        () => vodQualityList.value.find(item => item.quality === currentQuality.value)?.url ?? null
    )

    const pickQuality = (list: BoostyVodDto[]): string | null => {
        const has = (quality: string | null): boolean =>
            !!quality && list.some(item => item.quality === quality)

        if (has(preferredQuality.value)) return preferredQuality.value
        if (has(FALLBACK_QUALITY)) return FALLBACK_QUALITY
        return list[0]?.quality ?? null
    }

    const resetSelection = (): void => {
        selectedPost.value = null
        vodQualityList.value = []
        currentQuality.value = null
    }

    const getAvailableVods = async (kpId: number): Promise<void> => {
        try {
            isListLoading.value = true

            const response = await vodsApi.getBoostyVods(kpId)
            postList.value = response.data
        } catch (e) {
            postList.value = []
        } finally {
            isListLoading.value = false
            isListLoaded.value = true
        }
    }

    const getPlayerLinks = async (vod: BoostyPostDto): Promise<void> => {
        try {
            isPlayerLoading.value = true
            selectedPost.value = vod

            vodQualityList.value = []
            currentQuality.value = null

            const response = await vodsApi.getBoostyPlayerLinks(vod.streamerName, vod.postId, vod.vid)

            vodQualityList.value = sortByQuality(response.data)
            currentQuality.value = pickQuality(vodQualityList.value)
        } catch (e) {
        } finally {
            isPlayerLoading.value = false
        }
    }

    /**
     * Смена качества меняет только url. selectedVod остаётся прежним,
     * поэтому медиа-элемент не пересоздаётся и позиция просмотра
     * восстанавливается (см. VideoMedia.vue).
     */
    const setQuality = (quality: string): void => {
        if (quality === currentQuality.value) return
        if (!vodQualityList.value.some(item => item.quality === quality)) return

        currentQuality.value = quality
        preferredQuality.value = quality
    }

    return {
        vodsList: postList,
        vodQualityList,
        selectedVod: selectedPost,
        currentVodUrl,
        currentQuality,
        isListLoading,
        isListLoaded,
        isPlayerLoading,
        getAvailableVods,
        getPlayerLinks,
        setQuality,
        resetSelection
    }
}