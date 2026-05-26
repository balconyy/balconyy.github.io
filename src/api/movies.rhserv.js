import { getApi } from '@/api/axios'

// ===== Симуляция ошибки =====
let isErrorSimulationEnabled = false // Переменная для включения/отключения симуляции ошибки
const simulatedErrorCode = 500

const simulateErrorIfNeeded = async () => {
  if (isErrorSimulationEnabled && simulatedErrorCode) {
    const status = parseInt(simulatedErrorCode, 10)
    const error = new Error(`Симулированная ошибка ${status}`)
    error.response = { status }
    throw error
  }
}

// Универсальный вызов запроса с симуляцией ошибки
const apiCall = async (callFn) => {
  await simulateErrorIfNeeded()
  const api = await getApi()
  return await callFn(api)
}

// ===== API-функции =====
const apiSearch = async (searchTerm) => {
  const { data } = await apiCall((api) => api.get(`/search/${searchTerm}`))
  return data
}


const getKpInfo = async (kpId) => {
  const { data } = await apiCall((api) => api.get(`/kp_info2/${kpId}`))
  return data
}

const getPlayers = async (kpId) => {
  const { data } = await apiCall((api) =>
    api.post(
      '/cache',
      new URLSearchParams({
        kinopoisk: kpId,
        type: 'movie'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
  )
  return data
}



export {
  apiSearch,
  getKpInfo,
  getPlayers
}
