<script setup>
import SiteRating from "@/features/player/components/info/SiteRating.vue";
import KpLogo from '@/assets/kp-logo.svg'
import ImdbLogo from '@/assets/imdb-logo.svg'
defineProps({
  movie: Object
})

const KINOPOISK_MOVIE_LINK="https://www.kinopoisk.ru/film/"
const IMDB_MOVIE_LINK="https://www.imdb.com/title/"

</script>

<template>
  <h1 class="content-title">{{movie?.titleMain || ''}}</h1>
  <div class="movie-links">
    <SiteRating v-if="movie?.kpId" :href="KINOPOISK_MOVIE_LINK+movie?.kpId" :icon-src="KpLogo"/>
    <SiteRating v-if="movie?.imdbId" :href="IMDB_MOVIE_LINK+movie?.imdbId" :icon-src="ImdbLogo"/>
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
.movie-links{
  position: relative;
  display: flex;
  justify-content: center;
  gap: 12px;
}

</style>