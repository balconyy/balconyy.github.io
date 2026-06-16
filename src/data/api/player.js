import {getPlayersAlt2} from "@/data/api/player.ddbb.js";

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
const getKinoBDPlayerDataByInid = async (...args) =>
    (await loadProvider('kinobd')).getPlayerDataByInid(...args)

const hasPlayers = (players) => {
    if (Array.isArray(players)) return players.length > 0
    if (!players || typeof players !== 'object') return false
    return Object.keys(players).length > 0
}



const getPlayersWithFallback = async (...args) => {
    const currentProvider = getCurrentProvider()

    const providerApi = await loadProvider(currentProvider)
    const players = await providerApi.getPlayersAlt2(...args)

    if (hasPlayers(players)) {
        return players
    }
    console.warn(`[movies] getPlayers returned no players on ${currentProvider}`)


    return {}
}


export {
    getKinoBDPlayerDataByInid,
    getPlayers,
}

