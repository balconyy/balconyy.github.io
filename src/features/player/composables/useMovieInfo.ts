import {ref, computed} from 'vue'
import {movieApi} from "../../../data/api/movie";
import {MovieInfoMapper} from "../../../data/mapper/movieInfoMapper";
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
            const rawRes = await movieApi.getMovie(kpId)
            state.value = 'success'
            movie.value = MovieInfoMapper.toMovieExtended(rawRes.data.movieInfo)
            timings.value = rawRes.data.timings
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