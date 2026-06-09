import axios from 'axios'

let isErrorSimulationEnabled = false
const simulatedErrorCode = 500

const DDBB_BASE_URL = 'https://p2.ddbb.lol'

const api = axios.create({
    baseURL: DDBB_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000,
})

const simulateErrorIfNeeded = async () => {
    if (isErrorSimulationEnabled && simulatedErrorCode) {
        const status = parseInt(simulatedErrorCode, 10)
        const error = new Error(`Simulated error ${status}`)
        error.response = {status}
        throw error
    }
}

const apiCall = async (callFn) => {
    await simulateErrorIfNeeded()
    return await callFn(api)
}

const ensureUniqueKey = (obj) => {
    let idx = 0
    while (obj[`${idx}`]) idx++
    return `${idx}`
}

const normalizePlayerType = (value) => String(value || 'Player').trim()

const toPlayersMap = (providers = [], {type = null, translationId = null} = {}) => {
    const players = {}
    const selectedType = type ? String(type).toLowerCase() : null
    const selectedTranslationId =
        translationId === null || translationId === undefined ? null : String(translationId)

    for (const provider of providers) {
        const providerType = normalizePlayerType(provider?.type)

        if (selectedType && providerType.toLowerCase() !== selectedType) {
            continue
        }

        const providerBaseIframe = provider?.iframeUrl || ''

        if (providerBaseIframe) {
            const key = ensureUniqueKey(players)
            players[key] = {
                name: key,
                translate: providerType,
                iframe: providerBaseIframe,
                quality: '',
                warning: false,
                source: 'ddbb',
                raw_data: provider
            }
        }

        const translations = Array.isArray(provider?.translations) ? provider.translations : []
        for (const translation of translations) {
            const iframe = translation?.iframeUrl || ''
            if (!iframe) continue

            const tId =
                translation?.id === null || translation?.id === undefined ? null : String(translation.id)
            if (selectedTranslationId && tId !== selectedTranslationId) continue

            const translationName = String(translation?.name || 'Translation').trim()
            const key = translationName
            players[key] = {
                name: key,
                translate: translationName,
                iframe,
                quality: translation?.quality || '',
                warning: false,
                source: 'ddbb',
                raw_data: translation,
                provider: providerType
            }
        }
    }

    return players
}

const getPlayersRaw = async (kpId, {n = 0} = {}) => {
    const {data} = await apiCall((client) =>
        client.get('/api/players', {
            params: {
                kinopoisk: String(kpId),
                n
            }
        })
    )

    return Array.isArray(data?.data) ? data.data : []
}

const getPlayers = async (kpId, options = {}) => {
    const providers = await getPlayersRaw(kpId, options)
    return toPlayersMap(providers, options)
}

export {
    getPlayers,
    getPlayersRaw
}

export const toggleErrorSimulation = (enabled) => {
    isErrorSimulationEnabled = enabled
}