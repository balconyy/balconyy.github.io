<script setup>
import SiteRating from "@/features/player/components/info/SiteRating.vue";
import KpLogo from '@/assets/kp-logo.svg'
import ImdbLogo from '@/assets/imdb-logo.svg'
import {useMovieStore} from "@/store/movie.ts";
import {ref, watch, watchEffect} from "vue";
import {useMovieInfo} from "@/features/player/composables/useMovieInfo.ts";
import TimingButton from "@/features/player/components/info/timing/TimingButton.vue";
import TimingScreen from "@/features/player/components/info/timing/TimingScreen.vue";

const KINOPOISK_MOVIE_LINK = "https://www.kinopoisk.ru/film/"
const IMDB_MOVIE_LINK = "https://www.imdb.com/title/"

const props = defineProps({
  kpId: {
    type: Number,
    required: true
  }
})

const {
  movie,
  timings,
  error,
  isSuccess,
  isLoading,
  getMovieInfo,
} = useMovieInfo()

const movieStore = useMovieStore()

watchEffect(async () => {
  if (props.kpId) {
    await getMovieInfo(props.kpId)
  }
})

watch(movie, (newVal) => {
  movieStore.addToHistory(newVal)
  document.title = `${movie.value.titleMain} — Balcony`
})


const isTimingOpen = ref(false)
const toggleTiming = () => {
  isTimingOpen.value = !isTimingOpen.value
}

</script>

<template>
  <h1 class="content-title">{{ movie?.titleMain || '' }}</h1>
  <div class="movie-links">
    <SiteRating v-if="movie?.kpId" :href="KINOPOISK_MOVIE_LINK+movie?.kpId" :icon="KpLogo"/>
    <SiteRating v-if="movie?.imdbId" :href="IMDB_MOVIE_LINK+movie?.imdbId" :icon="ImdbLogo"/>
    <div class="timing-wrapper">
      <TimingButton v-if="timings.length" @click="toggleTiming"/>
      <TimingScreen
          v-if="isTimingOpen"
          :timings="timings"
          @close="isTimingOpen = false"
      />
    </div>
  </div>
</template>

<style scoped>
.content-title {
  position: relative;
  color: var(--white);
  z-index: 2;
  font-size: clamp(30px, 2vw, 42px);
  margin: 0;
  padding: 18px;
  line-height: 1.05;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  transition: all 0.3s ease;
}

.movie-links {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.timing-wrapper {
  position: relative;
  display: inline-flex;
}

</style>