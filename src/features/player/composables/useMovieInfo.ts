import {ref, computed} from 'vue'
import {searchApi} from "../../../data/api/search";
import {FilmMapper} from "../../../data/mapper/film.mapper";
import {MovieExtended} from "../../../models/movie";

export function useMovieInfo() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const isSuccess = computed(() => state.value === 'success')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)
    const movie = ref<MovieExtended>()

    const getMovieInfo = async (kpId: number) => {
        error.value = null
        state.value = 'loading'

        try {
            const rawRes = await searchApi.film(kpId)
            state.value = 'success'
            return movie.value = FilmMapper.toMovieExtended(rawRes.data)
        } catch (e) {
            state.value = 'error'
            error.value = e
        }
    }

    return {
        movie,
        error,
        isSuccess,
        isLoading,
        getMovieInfo,
    }
}