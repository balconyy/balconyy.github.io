import {computed, ref} from 'vue'
import {movieApi} from "../../../data/api/movie";
import {SearchMapper} from "../../../data/mapper/searchMapper";
import {useMovieStore} from "../../../store/movie";

let controller: AbortController | null = null;

export function useSearch() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')


    const isSuccess = computed(() => state.value === 'success')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)

    const store = useMovieStore()
    const searchText = computed(() => store.searchText)
    const movieList = computed(() => store.query)

    const searchMovies = async (query: string) => {
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();

        error.value = null
        state.value = 'loading'

        try {
            const rawRes = await movieApi.search(query, controller)
            const list = SearchMapper.toDomainList(rawRes.data.films).slice(0, 18)
            if (list.length > 0) {
                state.value = 'success'
                store.saveQuery(query, list)
            } else {
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

    const initSearch = () => {
        store.hydrateQuery()
    }


    return {
        movieList,
        searchText,
        error,
        isSuccess,
        isLoading,
        initSearch,
        searchMovies,
    }
}