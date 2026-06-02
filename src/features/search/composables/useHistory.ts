import {ref} from "vue";
import {Movie} from "@/models/movie";
import {useRouter} from "vue-router";
import {useMovieStore} from "../../../store/movie";


export function useHistory() {
    const router = useRouter();
    const movieStore = useMovieStore();

    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const history = ref<Movie[]>([])
    const errorMessage = ref<string>()

    const getLocalHistory = () => {
        history.value = movieStore.getFullHistory()
        if (history.value.length > 0) state.value = 'success'
        else {
            state.value = 'error'
            errorMessage.value = `Ваша история пустая`
        }

    }

    const removeMovieFromHistory = (movie: Movie) => {
        movieStore.removeFromHistory(movie.id)
        history.value = movieStore.getFullHistory()
        if (history.value.length > 0) state.value = 'success'
        else {
            state.value = 'error'
            errorMessage.value = `Ваша история пустая`
        }

    }

    return {
        history,
        errorMessage,
        getLocalHistory,
        removeMovieFromHistory
    }
}