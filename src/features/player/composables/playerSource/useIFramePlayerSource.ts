import {computed, type Ref} from 'vue'


import {useIFramePlayer} from '@/features/player/composables/useIFramePlayer'
import type {PlayerState} from '@/models/playerModels'
import {PlayerSource} from "@/features/player/contract/playerSource";
import IFrameMedia from "@/features/player/components/IFrameMedia.vue";

const VPN_HINT = 'Если плеер не грузится, то смените плеер выше или включите VPN'
const PLAYERS_LOADING = 'Загружается список плееров'

export function useIFramePlayerSource(
    playerState: Ref<PlayerState | null | undefined>
): PlayerSource {
    const core = useIFramePlayer(playerState)

    // Список плееров приходит извне, поэтому "резолвнут" = стейт доехал
    // и больше не грузится. Ошибка тоже считается ответом: плееров нет.
    const isResolved = computed<boolean>(() => {
        const state = playerState.value
        return !!state && !state.isLoading
    })

    return {
        type: 'movie',
        mediaComponent: IFrameMedia,

        items: computed(() =>
            core.players.value.map(player => ({key: player.name, label: player.name}))
        ),
        selectedKey: computed(() => core.selectedPlayer.value?.name ?? null),
        selectedLabel: computed(() => core.selectedPlayerLabel.value),

        isResolved,
        isAvailable: computed(() => isResolved.value && core.players.value.length > 0),

        mediaId: computed(() => core.selectedPlayer.value?.name ?? null),
        mediaUrl: computed(() => core.selectedPlayer.value?.iframe ?? null),
        mediaLabel: computed(() => core.selectedPlayer.value?.name ?? ''),
        loadingText: computed(
            () => `Загружается плеер: ${core.selectedPlayer.value?.name || PLAYERS_LOADING}\n${VPN_HINT}`
        ),

        // Внутри чужого iframe мы ничем не управляем — накладывать кнопки
        // поверх нельзя, они перекроют его собственные контролы.
        overlay: computed(() => null),

        isLoading: computed(() => false),
        emptyMessage: computed(() => core.playersEmptyMessage.value),
        errorMessage: computed(() => core.errorMessage.value),
        errorCode: computed(() => core.errorCode.value),

        select: (key: string): void => {
            const player = core.players.value.find(item => item.name === key)
            if (player) core.selectPlayer(player)
        },

        activate: (): void => {
            // Нечего подгружать: данные приходят через playerState.
        }
    }
}