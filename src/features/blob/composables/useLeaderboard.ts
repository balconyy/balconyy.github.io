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
        } catch (e) {
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