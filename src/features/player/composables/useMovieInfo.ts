import {computed, ref} from 'vue'
import {movieApi} from "../../../data/api/movie";
import {Timing} from "../../../models/timing";
import {Player} from "../../../models/player";
import {Movie} from "../../../models/movie";
import {Link} from "../../../models/link";
import {Relation, ReviewResponse} from "../../../data/dto/movieAddonDTO";

export function useMovieInfo() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const isSuccess = computed(() => state.value === 'success')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)
    const movie = ref<Movie>()
    const links = ref<Link[]>()
    const players = ref<Player[]>()


    const timings = ref<Timing[]>([])
    const relations = ref<Relation[]>([])
    const reviewsResponse = ref<ReviewResponse[]>([])

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
            const response = await movieApi.getMovie(kpId)
            state.value = 'success'
            movie.value = response.data.movieInfo
            links.value = response.data.links
            players.value = response.data.players
            const lbSlug = response.data.links.find(
                (l) => l.type === 'LETTERBOXD'
            )?.id
            await getMovieAddons(kpId, lbSlug)

        } catch (e) {
            state.value = 'error'
            error.value = e
        }
    }

    const getMovieAddons = async (kpId: number, lbSlug :string | null) => {
        try {
            const response = await movieApi.getMovieAddons(kpId, lbSlug)
            timings.value = response.data.timings
            relations.value = response.data.relations
            reviewsResponse.value = response.data.reviews
        } catch (e) {
            console.error(e)
        }
    }

    return {
        movie,
        playerState,
        links,
        timings,
        relations,
        reviewsResponse,
        error,
        isSuccess,
        isLoading,
        getMovieInfo,
        getMovieAddons
    }
}