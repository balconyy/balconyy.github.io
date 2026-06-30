import {ref} from "vue";
import {movieApi} from "@/data/api/movie";
import {RecentlyLists} from "../../../data/dto/movieAddonDTO";

export function useRecentlyWatch() {

    const recentlyWatched = ref<RecentlyLists>()

    const getRecentlyWatch = async () => {

        try {
            const response = await movieApi.getRecentlyWatched();
            recentlyWatched.value = response.data
        }
        catch (error) {

        }
    }

    return {
        recentlyWatched,
        getRecentlyWatch
    }
}