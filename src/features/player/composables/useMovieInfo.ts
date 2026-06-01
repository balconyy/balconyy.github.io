import {ref, computed, toRefs, Ref} from 'vue'
import {Movie} from "../../../models/movie";
import {searchApi} from "../../../data/api/search";
import {SearchMapper} from "../../../data/mapper/search.mapper";
import {FilmMapper} from "../../../data/mapper/film.mapper";
import {MovieFull} from "../../../models/movie.full";



let controller: AbortController | null = null;

export function useMovieInfo() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const isSuccess = computed(() => state.value === 'success')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)
    const movie = ref<MovieFull>()

    const searchMovie = async (kpId: number) => {
        error.value = null
        state.value = 'loading'

        try {
            const rawRes = await searchApi.film(kpId)
            state.value = 'success'
            return movie.value = FilmMapper.toMovieFull(rawRes.data)
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
        searchMovie,
    }
}