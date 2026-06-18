const providerImporters = {
    balcony: () => import('@/data/api/player.balcony.js')
}

const loadProvider = () => {
    return providerImporters.balcony()
}

const getCurrentProvider = () => {
    return 'balcony'
}


const getPlayers = async (...args) => {
    const currentProvider = getCurrentProvider()
    const providerApi = await loadProvider(currentProvider)
    return await providerApi.getPlayers(...args)
}



export {
    getPlayers
}

