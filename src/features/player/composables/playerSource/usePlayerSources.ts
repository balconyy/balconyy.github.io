import {computed, ref, watch, type ComputedRef, type Ref} from 'vue'

import type {PlayerState, PlayerType} from '@/models/playerModels'
import {PlayerSource} from "@/features/player/contract/playerSource";
import {useIFramePlayerSource} from "@/features/player/composables/playerSource/useIFramePlayerSource";
import {useVodPlayerSource} from "@/features/player/composables/playerSource/useVodPlayerSource";

interface UsePlayerSourcesOptions {
    initialType: Ref<PlayerType>
    playerState: Ref<PlayerState | null | undefined>
    kpId: Ref<number | undefined>
}

/**
 * Единственное место, где хранится текущий тип плеера и живёт реестр
 * реализаций. Все источники создаются сразу (иначе тумблер не сможет
 * переключиться на ещё не созданный) и сразу же получают prefetch, чтобы
 * понять, в каком из них есть контент.
 */
export function usePlayerSources(options: UsePlayerSourcesOptions) {
    const sources: Record<PlayerType, PlayerSource> = {
        movie: useIFramePlayerSource(options.playerState),
        vod: useVodPlayerSource(options.kpId),
    }

    const playerTypes = Object.keys(sources) as PlayerType[]

    const type = ref<PlayerType>(options.initialType.value)

    watch(options.initialType, (next) => {
        if (next) type.value = next
    })

    const activeSource = computed<PlayerSource>(() => sources[type.value])

    const setType = (next: PlayerType): void => {
        type.value = next
    }

    watch(
        type,
        (next, prev) => {
            if (prev && prev !== next) sources[prev].deactivate?.()
            sources[next].activate()
        },
        {immediate: true}
    )

    playerTypes.forEach(playerType => sources[playerType].prefetch?.())

    /**
     * Тумблер имеет смысл только когда выбирать реально есть из чего.
     * Пока источники не резолвнуты, isAvailable = false, так что тумблер
     * не мигает на старте, а появляется один раз.
     */
    const isToggleVisible = computed<boolean>(() =>
        playerTypes.every(playerType => sources[playerType].isAvailable.value)
    )

    /**
     * Активный источник оказался пустым, а соседний — нет: молча уходим
     * на него. Условие "резолвнут и пуст" не даёт переключиться раньше
     * времени и не спорит с ручным выбором пользователя.
     */
    watch(
        () =>
            playerTypes.map(playerType => {
                const source = sources[playerType]
                return `${playerType}:${source.isResolved.value}:${source.isAvailable.value}`
            }).join('|'),
        () => {
            const active = sources[type.value]
            if (!active.isResolved.value || active.isAvailable.value) return

            const fallback = playerTypes.find(
                playerType => playerType !== type.value && sources[playerType].isAvailable.value
            )

            if (fallback) setType(fallback)
        },
        {immediate: true}
    )

    // PlayerToggle работает с boolean — мостик держим здесь, а не в компоненте.
    const isVodMode = computed<boolean>({
        get: () => type.value === 'vod',
        set: (value) => setType(value ? 'vod' : 'movie'),
    })

    const from = <T>(pick: (source: PlayerSource) => ComputedRef<T>): ComputedRef<T> =>
        computed(() => pick(activeSource.value).value)

    return {
        type,
        setType,
        isVodMode,
        isToggleVisible,
        activeSource,

        mediaComponent: computed(() => activeSource.value.mediaComponent),
        items: from(source => source.items),
        selectedKey: from(source => source.selectedKey),
        selectedLabel: from(source => source.selectedLabel),
        mediaId: from(source => source.mediaId),
        mediaUrl: from(source => source.mediaUrl),
        mediaLabel: from(source => source.mediaLabel),
        loadingText: from(source => source.loadingText),
        overlay: from(source => source.overlay),
        isLoading: from(source => source.isLoading),
        emptyMessage: from(source => source.emptyMessage),
        errorMessage: from(source => source.errorMessage),
        errorCode: from(source => source.errorCode),

        select: (key: string): void => activeSource.value.select(key),
    }
}