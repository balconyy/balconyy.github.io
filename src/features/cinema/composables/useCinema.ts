import {ref} from 'vue'
import type {CinemaMovie} from '@/models/cinemaMovie'
import {cinemaApi} from '@/data/api/cinema'
import {CinemaSyncDto} from "@/data/dto/cinemaSyncDto";
import {onWsEvent, onWsConnectionChange} from '@/services/webSocket'

const movie = ref<CinemaMovie | null>(null)
const iframe = ref<string | null>(null)
const currentTimeSec = ref(0)
const isLoading = ref(false)

function setState(payload: CinemaSyncDto) {
    movie.value = payload.movie
    iframe.value = payload.iframe
    currentTimeSec.value =
        Date.now() / 1000 - payload.startedTimeSec;
}

function applySync(payload: CinemaSyncDto) {
    setState(payload)
}

async function fetchSync() {
    if (isLoading.value) return
    isLoading.value = true
    try {
        const response = await cinemaApi.getSync()
        setState(response.data)
    } catch (e: any) {
        if (e?.response?.status === 404) {
            clear()
        } else {
            console.error('Не удалось получить /cinema/sync', e)
        }
    } finally {
        isLoading.value = false
    }
}

function clear() {
    movie.value = null
    iframe.value = null
    currentTimeSec.value = 0
}

onWsEvent('cinema_sync', (event) => applySync(event))

onWsConnectionChange('cinema', (connected) => {
    if (connected) fetchSync()
})

export function useCinema() {
    return {
        movie,
        iframe,
        currentTimeSec,
        isLoading,
        applySync,
        fetchSync,
        clear,
    }
}