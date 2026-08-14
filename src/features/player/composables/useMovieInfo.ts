import {computed, ref} from 'vue'
import {movieApi} from "@/data/api/movie";
import {Player} from "@/models/player";
import {Link} from "@/models/link";
import {Relation, ReviewResponse} from "@/data/dto/movieAddonDTO";
import {MovieInfo} from "@/models/movie";
import {useTiming} from "@/features/player/composables/useTiming";
import {useStreamerInfo} from "@/features/streamer/composables/useStreamerInfo";
import {useMovieStore} from "@/store/movie";

export function useMovieInfo() {
    const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
    const isLoading = computed(() => state.value === 'loading')

    const error = ref<Error | null>(null)
    const movie = ref<MovieInfo | null>(null)
    const links = ref<Link[]>()
    const players = ref<Player[]>()

    const relations = ref<Relation[]>([])
    const reviewsResponse = ref<ReviewResponse[]>([])

    const movieStore = useMovieStore()

    const {
        getTimings
    } = useTiming()

    const {
        ratings,
        getStreamersRating,
        emptyRating
    } = useStreamerInfo()

    const playerState = computed(() => ({
        data: players.value,
        isLoading: state.value === 'loading',
        isError: state.value === 'error',
        error: error.value,
    }))

    const getMovieInfo = async (kpId: number) => {
        error.value = null
        state.value = 'loading'

        players.value = []
        movie.value = null
        relations.value = []
        reviewsResponse.value = []
        emptyRating()

        try {
            const response = await movieApi.getMovie(kpId)

            movie.value = response.data.movie
            players.value = response.data.players
            links.value = mapMovieLinks(response.data.movie)

            movieStore.addToHistory(response.data.movie)

            await Promise.all([
                getStreamersRating(kpId),
                getTimings(kpId),
                getMovieRelations(kpId),
                getMovieReviews(response.data.movie.lbSlug),
            ])

            state.value = 'success'
        } catch (e) {
            state.value = 'error'
            error.value = e as Error
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
        relations,
        reviewsResponse,
        ratings,
        error,
        isLoading,
        getMovieInfo
    }
}