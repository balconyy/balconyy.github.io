import {ref, computed} from 'vue'
import {movieApi} from "../../../data/api/movie";
import {MovieInfoMapper} from "../../../data/mapper/movieInfoMapper";
import {MovieExtended} from "../../../models/movie";
import {Timing} from "../../../models/timing";
import {Relation} from "../../../data/dto/movieDTO";
import {Player} from "../../../models/player";

export function useMovieInfo() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const isSuccess = computed(() => state.value === 'success')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)
    const movie = ref<MovieExtended>()
    const players = ref<Player[]>()
    const timings = ref<Timing[]>([])
    const relations = ref<Relation[]>([])

    const playerState = computed(() => ({
        data: players.value,
        isLoading: state.value === 'loading',
        isError: state.value === 'error',
        error: error.value,
    }))

    const getMovieInfo = async (kpId: number) => {
        error.value = null
        state.value = 'loading'

        try {
            const rawRes = await movieApi.getMovie(kpId)
            state.value = 'success'
            movie.value = MovieInfoMapper.toMovieExtended(rawRes.data.movieInfo)
            timings.value = rawRes.data.timings
            relations.value = rawRes.data.relations
            players.value = rawRes.data.players
        } catch (e) {
            state.value = 'error'
            error.value = e
        }
    }

    return {
        movie,
        playerState,
        timings,
        relations,
        error,
        isSuccess,
        isLoading,
        getMovieInfo,
    }
}