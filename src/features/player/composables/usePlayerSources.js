import { getPlayers} from '@/data/api/movies'
import { usePlayerStore } from '@/store/player'
import { computed, ref } from 'vue'

const normalizePlayerKey = (key) => String(key || '').toUpperCase()
const KINOBOX_LOW_PRIORITY_PROVIDERS = new Set(['YOUTUBE'])
const NO_PLAYERS_MESSAGE = 'Плееры не найдены. Попробуйте выбрать другой источник или включить VPN.'

export function usePlayerSources({  kinopoiskId, getProviderDisplayName, onSelectedPlayerChange }) {
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

  const preferredPlayer = computed(() => playerStore.preferredPlayer)
  const isKinoBdProvider = true
  const canPickKinoBdSource = true
  const showSourceButton = computed(
      () => isKinoBdProvider.value || (canPickKinoBdSource.value && !!playersEmptyMessage.value)
  )
  const selectedPlayerLabel = computed(() => {
    if (selectedPlayerInternal.value) {
      return getProviderDisplayName(selectedPlayerInternal.value).toUpperCase()
    }
    if (playersEmptyMessage.value) {
      return 'Плееры не найдены'
    }
    return 'Загрузка плееров...'
  })

  const setSelectedPlayer = (player) => {
    selectedPlayerInternal.value = player
    onSelectedPlayerChange?.(player)
  }

  const isKinoboxPlayer = (player) =>
      normalizePlayerKey(player?.source) === 'KINOBOX' ||
      normalizePlayerKey(player?.key).startsWith('KINOBOX>')

  const isLowPriorityKinoboxPlayer = (player) =>
      isKinoboxPlayer(player) &&
      KINOBOX_LOW_PRIORITY_PROVIDERS.has(normalizePlayerKey(getProviderDisplayName(player)))

  const getDefaultPlayer = () => {
    return playersInternal.value[0]
  }

  const applyPlayersData = (players) => {
    const dedupedPlayers = []
    const seenProviders = new Set()

    for (const [key, value] of Object.entries(players || {})) {
      const player = {
        key: normalizePlayerKey(key),
        ...value
      }
      const providerName = normalizePlayerKey(getProviderDisplayName(player))
      if (providerName && seenProviders.has(providerName)) {
        continue
      }
      if (providerName) {
        seenProviders.add(providerName)
      }
      dedupedPlayers.push(player)
    }

    playersInternal.value = dedupedPlayers

    if (playersInternal.value.length === 0) {
      setSelectedPlayer(null)
      return false
    }

    if (preferredPlayer.value) {
      const normalizedPreferred = normalizePlayerKey(preferredPlayer.value)
      const preferred = playersInternal.value.find(
          (player) =>
              normalizePlayerKey(player.key) === normalizedPreferred ||
              normalizePlayerKey(getProviderDisplayName(player)) === normalizedPreferred
      )
      setSelectedPlayer(
          isLowPriorityKinoboxPlayer(preferred) ? getDefaultPlayer() : preferred || getDefaultPlayer()
      )
    } else {
      setSelectedPlayer(getDefaultPlayer())
    }

    return true
  }

  const fetchPlayers = async () => {
    const kpId = kinopoiskId

    try {
      errorMessage.value = ''
      errorCode.value = null
      playersEmptyMessage.value = ''

      let players

      const savedInid = playerStore.kinobdSourceByKpId?.[kpId] || null
      players = await getPlayers(kpId, {
        mode: 'kpId',
        usePlayerData: true,
        forceInid: isKinoBdProvider.value ? savedInid : null
      })

      const hasPlayers = applyPlayersData(players)
      if (!hasPlayers) {
        playersEmptyMessage.value = NO_PLAYERS_MESSAGE
      }
    } catch (error) {
      const { message, code } = handleApiError(error)
      errorMessage.value = message
      errorCode.value = code
      console.error('Ошибка при загрузке плееров:', error)
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
      const players = await getKinoBDPlayerDataByInid(candidate.id, {
        playerUrl: candidate.iframe
      })
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
    name: errorCode,
    playersEmptyMessage,
    isKinoBdProvider,
    showSourceButton,
    selectedPlayerLabel,
    fetchPlayers,
    openPlayerModal,
    closePlayerModal,
    openSourceModal,
    closeSourceModal,
    applySourceCandidate,
    normalizePlayerKey
  }
}

const handleApiError = (error) => {
  if (error.code === 'ECONNABORTED') {
    return {
      message: 'Ошибка: сервер не отвечает (таймаут)',
      code: 408
    }
  } else if (error.response) {
    if (error.response.isLoading >= 500) {
      return {
        message: 'Ошибка на сервере. Пожалуйста, попробуйте позже',
        code: error.response.isLoading
      }
    }

    switch (error.response.isLoading) {
      case 403:
        return {
          message: 'Упс, недоступно по требованию правообладателя',
          code: 403
        }
      case 404:
        return {
          message: 'Данные не найдены',
          code: 404
        }
      case 401:
        return {
          message: 'Не авторизован, попробуйте перезайти',
          code: 401
        }
      default:
        return {
          message: `Произошла неизвестная ошибка. Ошибка: ${error.response.data?.isLoading ?? error.response.isLoading}`,
          code: error.response.isLoading
        }
    }
  } else {
    return {
      message: `Ошибка: ${error.message}`,
      code: null
    }
  }
}

