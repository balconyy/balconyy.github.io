import {computed, ref} from 'vue'
import {movieApi} from "@/data/api/movie";
import {Timing} from "@/models/timing";
import {Player} from "@/models/player";
import {Link} from "@/models/link";
import {Relation, ReviewResponse} from "@/data/dto/movieAddonDTO";
import {MovieInfo} from "@/models/movie";

export function useMovieInfo() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const isSuccess = computed(() => state.value === 'success')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)
    const movie = ref<MovieInfo>()
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
            movie.value = response.data.movie
            players.value = response.data.players
            links.value = mapMovieLinks(response.data.movie)

            await Promise.all([
                getMovieTimings(kpId),
                getMovieRelations(kpId),
                getMovieReviews(response.data.movie.lbSlug),
            ])

        } catch (e) {
            state.value = 'error'
            error.value = e as Error
        }
    }

    const getMovieTimings = async (kpId: number) => {
        try {
            const response = await movieApi.getTimings(kpId)
            timings.value = response.data
        } catch (e) {
            console.error(e)
        }
    }

    const getMovieRelations = async (kpId: number) => {
        try {
            const response = await movieApi.getRelations(kpId)
            relations.value = response.data
        } catch (e) {
            console.error(e)
        }
    }

    const getMovieReviews = async (lbSlug: string | null | undefined) => {
        if (!lbSlug) return
        try {
            const response = await movieApi.getReviews(lbSlug)
            reviewsResponse.value = response.data
        } catch (e) {
            console.error(e)
        }
    }

    function mapMovieLinks(movie: MovieInfo): Link[] {
        return [
            movie.kpId && {
                type: 'KP',
                id: String(movie.kpId),
            },
            movie.lbSlug && {
                type: 'LETTERBOXD',
                id: movie.lbSlug,
            },
            movie.imdbId && {
                type: 'IMDB',
                id: movie.imdbId,
            },
        ].filter(Boolean) as Link[];
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
        getMovieTimings,
        getMovieRelations,
        getMovieReviews

    }
}