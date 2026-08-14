import {ref} from 'vue'
import {Timing} from '@/models/timing'
import {timingApi} from '@/data/api/timing'
import {mapDtoToTiming} from "@/data/mapper/timingMapper";

export function useTiming() {
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    const timings = ref<Timing[]>([])

    const getTimings = async (kpId: number) => {
        timings.value = []
        isLoading.value = true
        error.value = null
        try {
            const response = await timingApi.getTimings(kpId)
            timings.value = response.data.map(mapDtoToTiming).sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        } catch (e) {
            error.value = e as Error
            console.error(e)
        } finally {
            isLoading.value = false
        }
    }

    const addTiming = async (kpId: number, timingText: string) => {
        try {
            isLoading.value = true
            await timingApi.saveTiming({kpId, timingText})
            await getTimings(kpId)
        } catch (e) {
            error.value = e as Error
        } finally {
        }
    }

    const deleteTiming = async (timingId: number, kpId: number) => {
        try {
            isLoading.value = true
            await timingApi.deleteTiming(timingId)
            await getTimings(kpId)
        } catch (e) {
            error.value = e as Error
        } finally {
        }

    }

    return {
        timings,
        isLoading,
        error,
        getTimings,
        addTiming,
        deleteTiming
    }
}