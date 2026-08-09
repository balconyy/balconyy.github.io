<script setup lang="ts">
import SiteReferer from "@/features/player/components/info/SiteReferer.vue";
import KpLogo from '@/assets/icons/kp-logo.svg'
import ImdbLogo from '@/assets/icons/imdb-logo.svg'
import LBLogo from '@/assets/icons/letterboxd-logo.svg'
import {computed} from "vue";
import TimingScreen from "@/features/player/components/info/timing/TimingScreen.vue";
import {Link} from "@/models/link";
import {MovieInfo} from "@/models/movie";

const KINOPOISK_MOVIE_LINK = "https://www.kinopoisk.ru/film/"
const LETTERBOXD_MOVIE_LINK = "https://letterboxd.com/film/"
const IMDB_MOVIE_LINK = "https://www.imdb.com/title/"

const props = defineProps<{
  movie: MovieInfo;
  links: Link[];
}>();

const kinopoisk = computed(() =>
    props.links?.find(link => link.type === 'KP')
);

const letterboxd = computed(() =>
    props.links?.find(link => link.type === 'LETTERBOXD')
);

const imdb = computed(() =>
    props.links?.find(link => link.type === 'IMDB')
);

</script>

<template>
  <div class="movie-info">
    <h1 class="content-title"><span class="title-bold">{{ movie?.titleMain || '' }}</span>
      {{ movie?.year ? " (" + movie?.year + ")" : '' }}
    </h1>
    <div class="movie-links">
      <SiteReferer v-if="kinopoisk" :href="KINOPOISK_MOVIE_LINK+kinopoisk.id" :icon="KpLogo" hint="Кинопоиск"/>
      <SiteReferer v-if="letterboxd" :href="LETTERBOXD_MOVIE_LINK+letterboxd.id" :icon="LBLogo" hint="Letterboxd"/>
      <SiteReferer v-if="imdb" :href="IMDB_MOVIE_LINK+imdb.id" :icon="ImdbLogo" hint="IMDB"/>
      <div class="timing-wrapper">
        <TimingScreen :kpId="movie.kpId"/>
      </div>
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

.title-bold {
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