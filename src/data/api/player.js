const PLAYER_PROVIDER_TIMEOUT_MS = 5000


const providerImporters = {
    ddbb: () => import('@/data/api/player.ddbb.js')
}

const loadProvider = () => {
    return providerImporters.ddbb()
}

const getCurrentProvider = () => {
    return 'ddbb'
}


const getPlayers = async (...args) => getPlayersWithFallback(...args)
const searchKinoBDPlayerCandidates = async (...args) =>
    (await loadProvider('kinobd')).searchPlayerCandidates(...args)
const getKinoBDPlayerDataByInid = async (...args) =>
    (await loadProvider('kinobd')).getPlayerDataByInid(...args)

const hasPlayers = (players) => {
    if (Array.isArray(players)) return players.length > 0
    if (!players || typeof players !== 'object') return false
    return Object.keys(players).length > 0
}

const createProviderTimeoutError = (provider) => {
    const error = new Error(`getPlayers timed out on ${provider}`)
    error.name = 'PlayerProviderTimeoutError'
    error.code = 'ECONNABORTED'
    return error
}

const withProviderTimeout = async (promise, provider) => {
    let timeoutId = null

    try {
        return await Promise.race([
            promise,
            new Promise((_, reject) => {
                timeoutId = setTimeout(
                    () => reject(createProviderTimeoutError(provider)),
                    PLAYER_PROVIDER_TIMEOUT_MS
                )
            })
        ])
    } finally {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
    }
}

const getPlayersWithFallback = async (...args) => {
    const currentProvider = getCurrentProvider()

    const providerApi = await loadProvider(currentProvider)
    const players = await withProviderTimeout(providerApi.getPlayers(...args), currentProvider)

    if (hasPlayers(players)) {
        return players
    }
    console.warn(`[movies] getPlayers returned no players on ${currentProvider}`)


    return {}
}


export {
    searchKinoBDPlayerCandidates,
    getKinoBDPlayerDataByInid,
    getPlayers,
}

