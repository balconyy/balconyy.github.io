<script setup>
import PlayerComponent from "@/features/player/components/PlayerComponent.vue";
import MovieInfo from "@/features/player/components/info/MovieInfo.vue";
import Background from "@/components/Background.vue";
import {watch, watchEffect} from "vue";
import {useMovieInfo} from "@/features/player/composables/useMovieInfo.ts";
import {useMovieStore} from "@/store/movie.ts";
import {useAnalytics} from "@/composables/useAnalytics.ts";
import RelationsList from "@/features/player/components/info/RelationsList.vue";
import {useRouter} from "vue-router";
import ReviewsList from "@/features/player/components/info/review/ReviewsList.vue";
import SidePanel from "@/components/SidePanel.vue";
import MovieInfoSkeleton from "@/features/player/components/info/MovieInfoSkeleton.vue";
import WinIcon from "@/components/WinIcon.vue";
import homeIcon from "@/assets/icons/home-icon.png";

const {kpId} = defineProps({
  kpId: {
    type: Number,
    required: true
  }
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
  getMovieTimings,
  getMovieRelations,
  getMovieReviews
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

function toMainScreen() {
  router.push({
    name: 'home',
  })
}

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
  <WinIcon class="home-icon" :icon="homeIcon" label="Главная" @open="toMainScreen"/>
  <SidePanel/>
  <MovieInfoSkeleton v-if="isLoading"/>
  <MovieInfo v-else-if="movie" :movie="movie" :links="links" :timings="timings"/>
  <PlayerComponent :playerState="playerState"/>
  <RelationsList v-if="relations && relations.length"
                 :movies="relations"
                 @selectMovie="onMovieClick"/>
  <ReviewsList v-if="reviewsResponse && reviewsResponse.length"
               :reviewsResponse="reviewsResponse"
  />

</template>

<style scoped>
.home-icon{
  z-index: 10;
  position: fixed;
  margin: 16px 0 0 16px;
}
</style>

