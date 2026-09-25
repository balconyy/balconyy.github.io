import {computed, ref, watch, type Ref} from 'vue'

import {useVodPlayer} from '@/features/player/composables/useVodPlayer'
import type {BoostyPostDto} from '@/data/dto/vod/boostyPostDto'
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

// vid обязателен: у одного поста может быть несколько прикреплённых
// видео (тот самый случай "фильм на 2-3 vod-а"), и без vid у них
// совпадал бы key — из-за этого при выборе одного ролика подсвечивались
// все остальные с тем же postId.
const vodKey = (vod: BoostyPostDto): string => `${vod.boostyChannel}:${vod.postId}:${vod.vid}`

/** Ключ поста без vid — для группировки vod-ов одного поста (см. computeMultiPartPosts). */
const postGroupKey = (vod: BoostyPostDto): string => `${vod.boostyChannel}:${vod.postId}`

const dateLabel = (vod: BoostyPostDto): string =>
    new Date(vod.dateTimestamp).toLocaleDateString('ru-RU')

/**
 * Episode "1" без диапазона (episodeFrom = episodeTo = 1, либо episodeTo
 * вовсе не задан при episodeFrom = 1). Сам по себе он не значит "пусто" —
 * это может быть первая из нескольких последовательных "частей" фильма
 * (episodeFrom = episodeTo = 1, 2, 3...). Опускать его имеет смысл только
 * там, где рядом есть сезон: тогда это просто дефолтный номер эпизода,
 * который сериалу проставили автоматически (см. seasonEpisodeLabel).
 */
const isTrivialEpisode = (vod: BoostyPostDto): boolean =>
    vod.episodeFrom === 1 && (vod.episodeTo == null || vod.episodeTo === 1)

/**
 * Внутри одного поста бэкенд иногда проставляет season (обычно 1) даже
 * записям, которые на деле — просто последовательные файлы одной записи
 * ("фильм на 2-3 vod-а"), а не серии сериала. Отличить это от настоящих
 * серий по одному vod-у нельзя, но можно по всей группе поста: если vod-ов
 * ≥2 и у каждого episodeFrom === episodeTo (то есть номер, а не диапазон),
 * а сами номера, если их отсортировать, идут подряд без пропусков —
 * считаем это мультичастевой записью и подписываем компонентом "Часть N"
 * вместо "Эпизод N" (и не опускаем тривиальную "Часть 1", в отличие от
 * тривиального эпизода — см. isTrivialEpisode).
 */
const computeMultiPartPosts = (vods: BoostyPostDto[]): Set<string> => {
    const byPost = new Map<string, BoostyPostDto[]>()

    for (const vod of vods) {
        const key = postGroupKey(vod)
        const group = byPost.get(key)
        if (group) group.push(vod)
        else byPost.set(key, [vod])
    }

    const multiPartPosts = new Set<string>()

    for (const [key, group] of byPost) {
        if (group.length < 2) continue

        const allSingleNumbers = group.every(
            vod => vod.episodeFrom != null && vod.episodeTo != null && vod.episodeFrom === vod.episodeTo
        )
        if (!allSingleNumbers) continue

        const numbers = group.map(vod => vod.episodeFrom as number).sort((a, b) => a - b)
        const isConsecutive = numbers.every((n, i) => i === 0 || n === numbers[i - 1] + 1)

        if (isConsecutive) multiPartPosts.add(key)
    }

    return multiPartPosts
}

/**
 * "Сезон N Эпизод M" / "Сезон N Эпизод M-K" — для сериала (есть season,
 * isPart = false). "Часть M" — либо мультичастевая запись внутри поста
 * (isPart = true, см. computeMultiPartPosts — там же тривиальный номер "1"
 * не опускается: иначе "Часть 1", "Часть 2" превратилось бы в "", "Часть 2"),
 * либо фильм на несколько vod-ов без сезона, где episodeFrom = episodeTo.
 * Если season не задан, а episodeFrom != episodeTo — это на деле сериал,
 * которому просто не проставили сезон, по умолчанию считаем его 1-м:
 * "Сезон 1 Серии M-K".
 * А при заданном сезоне и isPart = false тривиальный episode "1"
 * (см. isTrivialEpisode) опускается — "Сезон 1", "Сезон 2"... без
 * бессмысленного "Эпизод 1" у каждого.
 * Пусто, если про ролик неизвестно ни то, ни другое (одиночный фильм).
 */
const seasonEpisodeLabel = (vod: BoostyPostDto, isPart: boolean): string => {
    if (vod.season != null) {
        const parts: string[] = [`Сезон ${vod.season}`]

        if (vod.episodeFrom != null) {
            if (isPart) {
                // Мультичастевая запись: номер части значим сам по себе,
                // тривиальность (episodeFrom === 1) тут не повод его опускать.
                parts.push(`Часть ${vod.episodeFrom}`)
            } else if (!isTrivialEpisode(vod)) {
                parts.push(
                    vod.episodeTo != null && vod.episodeTo !== vod.episodeFrom
                        ? `Эпизод ${vod.episodeFrom}-${vod.episodeTo}`
                        : `Эпизод ${vod.episodeFrom}`
                )
            }
        }

        return parts.join(' ')
    }

    if (vod.episodeFrom != null) {
        if (isPart) return `Часть ${vod.episodeFrom}`

        return vod.episodeTo != null && vod.episodeTo !== vod.episodeFrom
            ? `Сезон 1 Серии ${vod.episodeFrom}-${vod.episodeTo}`
            : `Часть ${vod.episodeFrom}`
    }

    return ''
}

/**
 * Полная подпись ролика: имя стримера + (сезон/серия, если есть) + дата.
 * Используется везде, кроме списка внутри раскрытой группы — там имя
 * стримера уже вынесено в заголовок группы.
 */
const fullVodLabel = (vod: BoostyPostDto, isPart: boolean): string => {
    const meta = seasonEpisodeLabel(vod, isPart)
    return `${vod.streamerName} - ${meta ? `${meta} - ` : ''}${dateLabel(vod)}`
}

/** Подпись ролика внутри раскрытой группы: без имени стримера. */
const groupedVodLabel = (vod: BoostyPostDto, isPart: boolean): string => {
    const meta = seasonEpisodeLabel(vod, isPart)
    return meta ? `${meta} - ${dateLabel(vod)}` : dateLabel(vod)
}

/**
 * Укороченная сезон/серия для SelectorBar: "S1, E2-5" / "P2". Та же логика,
 * что в seasonEpisodeLabel (включая пропуск тривиального episode "1" только
 * при заданном сезоне, см. isTrivialEpisode), но в компактной нотации и без
 * слов на русском — панель узкая, дата туда не влезает и не нужна.
 */
const shortSeasonEpisode = (vod: BoostyPostDto, isPart: boolean): string => {
    if (vod.season != null) {
        const parts: string[] = [`С:${vod.season}`]

        if (vod.episodeFrom != null) {
            if (isPart) {
                parts.push(`Ч:${vod.episodeFrom}`)
            } else if (!isTrivialEpisode(vod)) {
                parts.push(
                    vod.episodeTo != null && vod.episodeTo !== vod.episodeFrom
                        ? `Э:${vod.episodeFrom}-${vod.episodeTo}`
                        : `Э:${vod.episodeFrom}`
                )
            }
        }

        return parts.join(', ')
    }

    if (vod.episodeFrom != null) {
        if (isPart) return `Ч:${vod.episodeFrom}`

        return vod.episodeTo != null && vod.episodeTo !== vod.episodeFrom
            ? `С:1, Э:${vod.episodeFrom}-${vod.episodeTo}`
            : `Ч:${vod.episodeFrom}`
    }

    return ''
}

/** Подпись для SelectorBar: короткая S/E-метка, а без неё — просто имя стримера. */
const compactVodLabel = (vod: BoostyPostDto, isPart: boolean): string => {
    const shortSeason = shortSeasonEpisode(vod, isPart)

    return [vod.streamerName, shortSeason].filter(Boolean).join(' - ')
}

/** Русское склонение "запись/записи/записей" для счётчика группы. */
const recordsWord = (count: number): string => {
    const mod10 = count % 10
    const mod100 = count % 100

    if (mod100 >= 11 && mod100 <= 14) return 'записей'
    if (mod10 === 1) return 'запись'
    if (mod10 >= 2 && mod10 <= 4) return 'записи'
    return 'записей'
}

interface VodGroup {
    key: string
    streamerName: string
    vods: BoostyPostDto[]
}

/**
 * Группировка по каналу: сериал или фильм на несколько vod-ов схлопывается
 * в одну запись с раскрывающимся списком, одиночный ролик остаётся плоским
 * пунктом. Внутри группы ролики сортируются по дате — так серии идут по
 * порядку независимо от порядка ответа бэкенда.
 */
const groupVodsByChannel = (vods: BoostyPostDto[]): VodGroup[] => {
    const groups = new Map<string, VodGroup>()

    for (const vod of vods) {
        const existing = groups.get(vod.boostyChannel)
        if (existing) {
            existing.vods.push(vod)
        } else {
            groups.set(vod.boostyChannel, {
                key: `group:${vod.boostyChannel}`,
                streamerName: vod.streamerName,
                vods: [vod],
            })
        }
    }

    for (const group of groups.values()) {
        group.vods.sort((a, b) => {
            // Сезон, явный или подразумеваемый как 1-й (см. seasonEpisodeLabel)
            const seasonA = a.season ?? (a.episodeFrom != null ? 1 : null)
            const seasonB = b.season ?? (b.episodeFrom != null ? 1 : null)

            if (seasonA != null && seasonB != null && seasonA !== seasonB) {
                return seasonA - seasonB
            }

            if (a.episodeFrom != null && b.episodeFrom != null && a.episodeFrom !== b.episodeFrom) {
                return a.episodeFrom - b.episodeFrom
            }

            // Номера нет у одного или обоих роликов — используем дату как запасной критерий
            return a.dateTimestamp - b.dateTimestamp
        })
    }

    return [...groups.values()]
}

export function useVodPlayerSource(kpId: Ref<number | undefined>): PlayerSource {
    const core = useVodPlayer()

    const isActive = ref(false)
    let loadedKpId: number | null = null

    /** Посты, чьи vod-ы — последовательные части одной записи, а не серии (см. computeMultiPartPosts). */
    const multiPartPosts = computed(() => computeMultiPartPosts(core.vodsList.value))
    const isPart = (vod: BoostyPostDto): boolean => multiPartPosts.value.has(postGroupKey(vod))

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


    /** То же самое, но в укороченном виде — для узкой SelectorBar. */
    const compactLabel = computed<string>(() => {
        if (core.selectedVod.value) return compactVodLabel(core.selectedVod.value, isPart(core.selectedVod.value))
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
            groupVodsByChannel(core.vodsList.value).map(group => {
                if (group.vods.length === 1) {
                    const vod = group.vods[0]
                    return {key: vodKey(vod), label: fullVodLabel(vod, isPart(vod))}
                }

                return {
                    key: group.key,
                    label: `${group.streamerName} - ${group.vods.length} ${recordsWord(group.vods.length)}`,
                    children: group.vods.map(vod => ({key: vodKey(vod), label: groupedVodLabel(vod, isPart(vod))})),
                }
            })
        ),
        selectedKey: computed(() =>
            core.selectedVod.value ? vodKey(core.selectedVod.value) : null
        ),
        selectedLabel: compactLabel,

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
            core.selectedVod.value ? fullVodLabel(core.selectedVod.value, isPart(core.selectedVod.value)) : ''
        ),
        loadingText: computed(() => {
            const label = core.selectedVod.value ? fullVodLabel(core.selectedVod.value, isPart(core.selectedVod.value)) : ''
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