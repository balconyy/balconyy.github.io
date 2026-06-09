import {ref, computed} from 'vue'
import {searchApi} from "../../../data/api/search";
import {FilmMapper} from "../../../data/mapper/film.mapper";
import {MovieExtended} from "../../../models/movie";
import {Timing} from "../../../models/timing";

export function useMovieInfo() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const isSuccess = computed(() => state.value === 'success')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)
    const movie = ref<MovieExtended>()
    const timings = ref<Timing[]>([])

    const getMovieInfo = async (kpId: number) => {
        error.value = null
        state.value = 'loading'

        try {
            const rawRes = await searchApi.film(kpId)
            state.value = 'success'
            movie.value = FilmMapper.toMovieExtended(rawRes.data)
            timings.value = movie.value.timings
        } catch (e) {
            state.value = 'error'
            error.value = e
        }
    }

    return {
        movie,
        timings,
        error,
        isSuccess,
        isLoading,
        getMovieInfo,
    }
}