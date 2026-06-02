import {ref} from "vue";
import {Movie} from "@/models/movie";
import {useRouter} from "vue-router";
import {useMovieStore} from "../../../store/movie";
import {searchApi} from "../../../data/api/search";
import {SearchMapper} from "../../../data/mapper/search.mapper";


export function useHistory() {
    const router = useRouter();
    const movieStore = useMovieStore();

    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const history = ref<Movie[]>([])
    const errorMessage = ref<string>()

    const getLocalHistory = (query: string) => {
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
        getLocalHistory
    }
}