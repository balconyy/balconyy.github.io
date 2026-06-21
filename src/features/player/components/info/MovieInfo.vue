<script setup>
import SiteReferer from "@/features/player/components/info/SiteReferer.vue";
import KpLogo from '@/assets/icons/kp-logo.svg'
import ImdbLogo from '@/assets/icons/imdb-logo.svg'
import LBLogo from '@/assets/icons/letterboxd-logo.svg'
import {useMovieStore} from "@/store/movie.ts";
import {ref, watch, watchEffect} from "vue";
import {useMovieInfo} from "@/features/player/composables/useMovieInfo.ts";
import TimingButton from "@/features/player/components/info/timing/TimingButton.vue";
import TimingScreen from "@/features/player/components/info/timing/TimingScreen.vue";
import {useAnalytics} from "@/composables/useAnalytics.ts";

const KINOPOISK_MOVIE_LINK = "https://www.kinopoisk.ru/film/"
const LETTERBOXD_MOVIE_LINK = "https://letterboxd.com/imdb/"
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
const analytics = useAnalytics()

watchEffect(async () => {
  if (props.kpId) {
    await getMovieInfo(props.kpId)
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


const isTimingOpen = ref(false)
const toggleTiming = () => {
  isTimingOpen.value = !isTimingOpen.value
}

</script>

<template>

  <h1 class="content-title"><span class="title-bold">{{ movie?.titleMain || '' }}</span>
    {{ movie?.year ? " (" + movie?.year + ")" : '' }}
  </h1>
  <div class="movie-links">
    <SiteReferer v-if="movie?.kpId" :href="KINOPOISK_MOVIE_LINK+movie?.kpId" :icon="KpLogo" hint="Кинопоиск"/>
    <SiteReferer v-if="movie?.imdbId" :href="LETTERBOXD_MOVIE_LINK+movie?.imdbId" :icon="LBLogo" hint="Letterboxd"/>
    <SiteReferer v-if="movie?.imdbId" :href="IMDB_MOVIE_LINK+movie?.imdbId" :icon="ImdbLogo" hint="IMDB"/>
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
  font-size: clamp(30px, 2vw, 42px);
  color: var(--white);
  z-index: 2;
  margin: 0;
  padding: 18px;
  line-height: 1.05;
  font-weight: 400;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  transition: all 0.3s ease;
}
.title-bold{
  font-weight: 800;
}

.movie-links {
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  gap: 12px;
}

.timing-wrapper {
  position: relative;
  display: inline-flex;
}

</style>