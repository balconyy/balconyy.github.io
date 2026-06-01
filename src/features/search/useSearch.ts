import {ref, computed} from 'vue'
import {searchApi} from "../../data/api/search";
import {MovieMapper} from "../../data/mapper/movie.mapper";
import {Movie} from "../../models/movie";

let controller: AbortController | null = null;

export function useSearch() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')


    const isSuccess = computed(() => state.value === 'success')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)
    const movieList = ref<Movie[]>([])

    const searchMovie = async (query: string) => {
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();

        error.value = null
        state.value = 'loading'

        try {
            const rawRes = await searchApi.search(query, controller)

            movieList.value = MovieMapper.toDomainList(rawRes.data.films).slice(0,18)
            if (movieList.value.length > 0) state.value = 'success'
            else {
                state.value = 'error'
                error.value = new Error(`По запросу "${query}" ничего не найдено`)
            }
        } catch (e) {
            if (e.name === 'CanceledError') {
                return;
            }

            state.value = 'error'
            error.value = e
        }
    }

    return {
        movieList,
        error,
        isSuccess,
        isLoading,
        searchMovie,
    }
}