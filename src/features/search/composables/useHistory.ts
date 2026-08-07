import {ref, watch} from "vue";
import {MovieKp} from "@/models/movieKp";
import {useMovieStore} from "@/store/movie";
import {MovieInfo} from "@/models/movie";


export function useHistory() {
    const movieStore = useMovieStore();
    movieStore.checkVersion()
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const history = ref<MovieInfo[]>([])
    const errorMessage = ref<string>()

    const getLocalHistory = () => {
        history.value = movieStore.getFullHistory()
        if (history.value.length > 0) state.value = 'success'
        else {
            state.value = 'error'
            errorMessage.value = `Ваша история пуста`
        }

    }

    const removeMovieFromHistory = (movie: MovieKp) => {
        movieStore.removeFromHistory(movie.kpId)
        history.value = movieStore.getFullHistory()
    }

    watch(history, (newVal) => {
        if (newVal.length > 0) {
            state.value = 'success'
            errorMessage.value = ''
        } else {
            state.value = 'error'
            errorMessage.value = 'Ваша история пуста'
        }
    }, {immediate: true})

    return {
        history,
        errorMessage,
        getLocalHistory,
        removeMovieFromHistory
    }
}