const providerImporters = {
    ddbb: () => import('@/data/api/player.ddbb.js')
}

const loadProvider = () => {
    return providerImporters.ddbb()
}

const getCurrentProvider = () => {
    return 'ddbb'
}


const getPlayers = async (...args) => {
    const currentProvider = getCurrentProvider()
    const providerApi = await loadProvider(currentProvider)
    const players = await providerApi.getPlayersAlt2(...args)
    console.log("wtf",players)
    return players
}



export {
    getPlayers
}

