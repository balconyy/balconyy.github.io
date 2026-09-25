import {ref} from "vue";
import {vodsApi} from "@/data/api/vods";
import {VodsCountDto} from "@/data/dto/vod/vodsCountDto";

export function useStreamerVodsList() {
    const isLoading = ref(false)
    const error = ref<Error | null>(null)
    const streamers = ref<VodsCountDto[]>([])

    const getVodStreamers = async () => {
        streamers.value = []
        isLoading.value = true
        error.value = null
        try {
            const response = await vodsApi.getStreamersVodsCount()
            streamers.value = response.data
        } catch (e) {
            error.value = e as Error
            console.error(e)
        } finally {
            isLoading.value = false
        }
    }


    return {
        streamers,
        isLoading,
        error,
        getVodStreamers
    }
}
