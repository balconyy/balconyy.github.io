import {computed, ref, watch} from 'vue'

const NO_PLAYERS_MESSAGE = 'Плееры не найдены.'

export function usePlayerSources(playerState) {

    const playersInternal = ref([])
    const selectedPlayerInternal = ref(null)
    const showPlayerModal = ref(false)
    const showSourceModal = ref(false)
    const sourceCandidates = ref([])
    const sourceLoading = ref(false)
    const sourceError = ref('')
    const errorMessage = ref('')
    const errorCode = ref(null)
    const playersEmptyMessage = ref('')

    const showSourceButton = computed(
        () => !!playersEmptyMessage.value
    )
    const selectedPlayerLabel = computed(() => {
        if (selectedPlayerInternal.value) {
            return selectedPlayerInternal.value.name
        }
        if (playersEmptyMessage.value) {
            return 'Плееры не найдены'
        }
        return 'Загрузка плееров...'
    })

    watch(
        () => playerState.value,
        (state) => {
            console.log('PLAYER STATE:', state)

            if (!state) return

            if (state.isLoading) {
                playersInternal.value = []
                selectedPlayerInternal.value = null

                errorMessage.value = ''
                errorCode.value = null
                playersEmptyMessage.value = ''

                return
            }

            if (state.isError) {
                playersInternal.value = []
                selectedPlayerInternal.value = null
                playersEmptyMessage.value = ''

                errorMessage.value =
                    state.error?.message || 'Ошибка загрузки'

                return
            }

            const players = state.data ?? []

            applyPlayersData(players)

            if (players.length === 0) {
                playersEmptyMessage.value = NO_PLAYERS_MESSAGE
            } else {
                playersEmptyMessage.value = ''
            }
        },
        {immediate: true}
    )

    const setSelectedPlayer = (player) => {
        selectedPlayerInternal.value = player
    }

    const getDefaultPlayer = () => {
        return playersInternal.value[0]
    }

    const applyPlayersData = (players) => {
        playersInternal.value = players

        if (playersInternal.value.length === 0) {
            setSelectedPlayer(null)
            return false
        } else {
            setSelectedPlayer(getDefaultPlayer())
            return true
        }
    }

    const openPlayerModal = () => {
        showPlayerModal.value = true
    }

    const closePlayerModal = () => {
        showPlayerModal.value = false
    }

    const openSourceModal = async () => {
        showSourceModal.value = true
        sourceLoading.value = false
    }

    const closeSourceModal = () => {
        showSourceModal.value = false
    }

    const applySourceCandidate = async (candidate) => {
        if (!candidate?.name) return

        sourceLoading.value = true
        sourceError.value = ''

        try {
            const players = {}
            const hasPlayers = applyPlayersData(players)
            if (!hasPlayers) {
                sourceError.value = NO_PLAYERS_MESSAGE
                return
            }
            playersEmptyMessage.value = ''
            closeSourceModal()
        } catch (error) {
            sourceError.value = 'Не удалось применить выбранный источник'
        } finally {
            sourceLoading.value = false
        }
    }

    return {
        playersInternal,
        selectedPlayerInternal,
        showPlayerModal,
        showSourceModal,
        sourceCandidates,
        sourceLoading,
        sourceError,
        errorMessage,
        errorCode,
        playersEmptyMessage,
        showSourceButton,
        selectedPlayerLabel,
        openPlayerModal,
        closePlayerModal,
        openSourceModal,
        closeSourceModal,
        applySourceCandidate,
    }
}

