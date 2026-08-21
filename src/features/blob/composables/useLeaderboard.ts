import {ref} from "vue";
import {blobApi} from "@/data/api/blob";
import {BlobLeaderDto} from "@/data/dto/blobLeaderDto";

export function useLeaderboard() {
    const isLoading = ref(false);
    const leaderboard = ref<BlobLeaderDto[]>([])

    const getLeaderboard = async () => {
        try {
            isLoading.value = true;

            const response = await blobApi.getLeaderboard()
            leaderboard.value = response.data
            console.log(response.data)
        } catch (e) {
            console.log(e)
        } finally {
            isLoading.value = false;
        }

    }


    return {
        leaderboard,
        isLoading,
        getLeaderboard
    }
}