import {computed, ref} from "vue";
import {movieApi} from "@/data/api/movie";
import {MovieKp} from "@/models/movieKp";

export function usePopular() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const isLoading = computed(() => state.value === 'loading')
    const error = ref<Error | null>(null)
    const currentPage = ref(1)

    // true, пока с сервера есть шанс получить ещё непоказанные фильмы
    const hasMore = ref(true)

    const popularList = ref<MovieKp[]>([])

    const getPopular = async () => {
        if (!hasMore.value) return

        error.value = null
        state.value = 'loading'

        try {
            const response = await movieApi.getPopularMovies(currentPage.value)

            const existingIds = new Set(popularList.value.map(movie => movie.kpId))
            const newMovies = response.data.filter(movie => !existingIds.has(movie.kpId))

            if (newMovies.length === 0) {
                hasMore.value = false
            } else {
                popularList.value = [...popularList.value, ...newMovies]
                currentPage.value++
            }

            state.value = 'success'

        } catch (e: any) {
            state.value = 'error'
            error.value = e
        }
    }


    return {
        popularList,
        error,
        isLoading,
        hasMore,
        getPopular,
    }
}