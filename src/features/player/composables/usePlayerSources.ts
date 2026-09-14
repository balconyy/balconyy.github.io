import {computed, ref, watch, type ComputedRef, type Ref} from 'vue'
import {Player} from "@/models/player";
import {PlayerState} from "@/models/playerModels";


const NO_PLAYERS_MESSAGE = 'Плееры не найдены.'
const NO_PLAYERS_LABEL = 'Плееры не найдены'
const LOADING_LABEL = 'Загрузка плееров...'
const DEFAULT_ERROR_MESSAGE = 'Ошибка загрузки'

export interface UsePlayerSourcesReturn {
    players: Ref<Player[]>
    selectedPlayer: Ref<Player | null>
    showPlayerModal: Ref<boolean>
    errorMessage: Ref<string>
    errorCode: Ref<string | number | null>
    playersEmptyMessage: Ref<string>
    selectedPlayerLabel: ComputedRef<string>
    selectPlayer: (player: Player) => void
    openPlayerModal: () => void
    closePlayerModal: () => void
}

export function usePlayerSources(
    playerState: Ref<PlayerState | null | undefined>
): UsePlayerSourcesReturn {

    const players = ref<Player[]>([])
    const selectedPlayer = ref<Player | null>(null)
    const showPlayerModal = ref(false)
    const errorMessage = ref('')
    const errorCode = ref<string | number | null>(null)
    const playersEmptyMessage = ref('')

    const selectedPlayerLabel = computed<string>(() => {
        if (selectedPlayer.value) {
            return selectedPlayer.value.name
        }
        if (playersEmptyMessage.value) {
            return NO_PLAYERS_LABEL
        }
        return LOADING_LABEL
    })

    watch(
        () => playerState.value,
        (state) => {

            if (!state) return

            if (state.isLoading) {
                players.value = []
                selectedPlayer.value = null

                errorMessage.value = ''
                errorCode.value = null
                playersEmptyMessage.value = ''

                return
            }

            if (state.isError) {
                players.value = []
                selectedPlayer.value = null
                playersEmptyMessage.value = ''

                errorMessage.value = state.error?.message || DEFAULT_ERROR_MESSAGE
                errorCode.value = state.error?.code ?? null

                return
            }

            errorMessage.value = ''
            errorCode.value = null

            applyPlayersData(state.data ?? [])
        },
        {immediate: true}
    )

    const applyPlayersData = (list: Player[]): void => {
        players.value = list
        playersEmptyMessage.value = list.length === 0 ? NO_PLAYERS_MESSAGE : ''
        selectedPlayer.value = list[0] ?? null
    }

    const selectPlayer = (player: Player): void => {
        if (selectedPlayer.value?.name === player.name) {
            closePlayerModal()
            return
        }

        selectedPlayer.value = player
        closePlayerModal()
    }

    const openPlayerModal = (): void => {
        showPlayerModal.value = true
    }

    const closePlayerModal = (): void => {
        showPlayerModal.value = false
    }

    return {
        players,
        selectedPlayer,
        showPlayerModal,
        errorMessage,
        errorCode,
        playersEmptyMessage,
        selectedPlayerLabel,
        selectPlayer,
        openPlayerModal,
        closePlayerModal,
    }
}