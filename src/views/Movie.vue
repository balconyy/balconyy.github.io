<script setup>
import PlayerComponent from "@/features/player/components/PlayerComponent.vue";
import MovieInfo from "@/features/player/components/info/MovieInfo.vue";
import Background from "@/components/Background.vue";
import {useDailyWindow} from "@/features/admin/composables/config/useDailyWindow.ts";
import {onMounted, watch, watchEffect} from "vue";
import DailyJoke from "@/components/DailyJoke.vue";
import {useMovieInfo} from "@/features/player/composables/useMovieInfo.ts";
import {useMovieStore} from "@/store/movie.ts";
import {useAnalytics} from "@/composables/useAnalytics.ts";
import RelationsList from "@/features/player/components/info/RelationsList.vue";
import {useRouter} from "vue-router";
import ReviewsList from "@/features/player/components/info/review/ReviewsList.vue";

const {kpId} = defineProps({
  kpId: {
    type: Number,
    required: true
  }
})
const {
  dailyJokeUrl,
  minHeight,
  currentHeight,
  isOpen,
  initDailyScreen,
  changeWindowState,
  setWindowHeight
} = useDailyWindow()


onMounted(() => {
  initDailyScreen()
})
const {
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
} = useMovieInfo()

const movieStore = useMovieStore()
const analytics = useAnalytics()

const router = useRouter()
const onMovieClick = (movie) => {
  router.push({
    name: 'movie',
    params: {kpId: movie.kpId},
  })
}


watchEffect(async () => {
  if (kpId) {
    await getMovieInfo(kpId)
  }
})

watch(movie, (newVal) => {
  movieStore.addToHistory(newVal)
  analytics.track("movie_loaded", {
    movie: newVal.titleMain ?? newVal.titleSecond,
    year: newVal.year,
  })
  document.title = `${movie.value.titleMain} — Balcony`
})

</script>

<template>
  <Background/>
  <DailyJoke v-if="dailyJokeUrl"
             :url="dailyJokeUrl"
             :currentHeight="currentHeight"
             :minHeight="minHeight"
             :isOpen="isOpen"
             @stopResizing="setWindowHeight"
             @buttonClicked="changeWindowState"
  />
  <MovieInfo :movie="movie" :links="links" :timings="timings"/>
  <PlayerComponent :playerState="playerState"/>
  <RelationsList v-if="relations && relations.length"
                 :movies="relations"
                 @selectMovie="onMovieClick"/>
  <ReviewsList v-if="reviewsResponse && reviewsResponse.length"
      :reviewsResponse="reviewsResponse"
  />

</template>

