import {ref, computed} from 'vue'
import {searchApi} from "../../data/api/search";
import {SearchMapper} from "../../data/mapper/search.mapper";
import {Movie} from "../../models/movie";
import {useRouter} from "vue-router";
import {useMovieStore} from "../../store/movie";

let controller: AbortController | null = null;

export function useSearch() {
    const router = useRouter();
    const movieStore = useMovieStore();

    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')


    const isSuccess = computed(() => state.value === 'success')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)
    const movieList = ref<Movie[]>([])

    const searchMovies = async (query: string) => {
        if (controller) {
            controller.abort();
        }
        controller = new AbortController();

        error.value = null
        state.value = 'loading'

        try {
            const rawRes = await searchApi.search(query, controller)

            movieList.value = SearchMapper.toDomainList(rawRes.data.films).slice(0,18)
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

    const onMovieClick =  (movie: Movie) => {
        movieStore.addToHistory(movie)
        router.push({
            name: 'movie',
            params: {
                kpId: movie.id
            }
        }).then(r => 404)


    }

    return {
        movieList,
        error,
        isSuccess,
        isLoading,
        searchMovie: searchMovies,
        onMovieClick
    }
}