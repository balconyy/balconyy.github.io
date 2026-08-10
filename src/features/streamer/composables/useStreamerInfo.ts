import {ref} from "vue";
import {StreamerRatingDto} from "@/data/dto/streamerRatingDto";
import {streamersApi} from "@/data/api/streamer";

export function useStreamerInfo() {
    const isLoading = ref(false)
    const ratings = ref<StreamerRatingDto[]>([])

    const getStreamersRating = async (kpId: number) => {
        try {
            isLoading.value = true
            const response = await streamersApi.getStreamerRating(kpId)
            ratings.value = response.data
        } catch (e) {
            console.error(e)
        } finally {
            isLoading.value = false
        }
    }


    return {
        ratings,
        isLoading,
        getStreamersRating,
    }
}