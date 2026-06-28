import {ref} from "vue";
import {movieApi} from "@/data/api/movie";
import {Movie} from "@/models/movie";

export function useRecentlyWatch() {

    const recentlyWatched = ref<Movie[]>([])

    const getRecentlyWatch = async () => {

        try {
            const response = await movieApi.getRecentlyWatched();
            recentlyWatched.value = response.data
        } catch (e) {
            recentlyWatched.value = []
        }
    }

    return {
        recentlyWatched,
        getRecentlyWatch
    }
}