import {getPlayers} from '@/data/api/player.js'
import {usePlayerStore} from '@/store/player'
import {computed, ref} from 'vue'

const NO_PLAYERS_MESSAGE = 'Плееры не найдены.'
const SERVER_TIMEOUT_MESSAGE = 'Иногда сервер не отвечает с первого раза. Попробуйте повторить запрос.'

export function usePlayerSources({kinopoiskId}) {
    const playerStore = usePlayerStore()

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
    const playersButtonIsActive = ref(false)

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

    const fetchPlayers = async () => {
        try {
            errorMessage.value = ''
            errorCode.value = null
            playersEmptyMessage.value = ''
            playersButtonIsActive.value = false

            let players = await getPlayers(kinopoiskId)

            const hasPlayers = applyPlayersData(players)
            if (!hasPlayers) {
                playersEmptyMessage.value = NO_PLAYERS_MESSAGE
            }
        } catch (error) {
            console.log(error)
            if (error.code === "ECONNABORTED") {
                playersEmptyMessage.value = SERVER_TIMEOUT_MESSAGE
                playersButtonIsActive.value = true
            } else {
                errorMessage.value = error.value
            }
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
        if (!candidate?.id) return

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
            playerStore.setKinoBdSource(kinopoiskId, candidate.id)
            closeSourceModal()
        } catch (error) {
            sourceError.value = 'Не удалось применить выбранный источник'
            console.error('Ошибка применения источника KinoBD:', error)
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
        playersButtonIsActive,
        showSourceButton,
        selectedPlayerLabel,
        fetchPlayers,
        openPlayerModal,
        closePlayerModal,
        openSourceModal,
        closeSourceModal,
        applySourceCandidate,
    }
}

