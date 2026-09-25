<script setup lang="ts">
import {computed} from 'vue'
import emptyPoster from '@/assets/media/empty-poster.jpg'
import {BoostyMovieCardDto} from "@/data/dto/vod/boostyMovieCardDto";

const props = defineProps<{
  vod: BoostyMovieCardDto
}>()

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target.src !== emptyPoster) {
    target.src = emptyPoster
  }
}

// Та же градация, что и в StreamerRating: зелёный / серый / красный
const ratingColor = computed<string | null>(() => {
  const r = props.vod.streamerRate
  if (r == null) return null
  if (r >= 7) return '#3BB33B'
  if (r >= 5) return '#777777'
  return '#FF0000'
})

const seasonEpisode = computed<string | null>(() => {
  const {season, episodeFrom, episodeTo} = props.vod
  if (season == null && episodeFrom == null) return null

  const parts: string[] = []
  if (season != null) parts.push(`S${season}`)
  if (episodeFrom != null) {
    parts.push(
        episodeTo != null && episodeTo !== episodeFrom
            ? `E${episodeFrom}-${episodeTo}`
            : `E${episodeFrom}`
    )
  }
  return parts.join(' ')
})
</script>

<template>
  <RouterLink :to="`/movie/${vod.kpId}`" class="movie-card-wrapper">
    <div class="movie-card">
      <div class="old-school-effect"/>
      <div class="poster-wrapper">
        <img
            class="poster"
            :src="vod.posterUrl"
            @error="onImgError"
            alt="poster"
        >
        <div v-if="seasonEpisode" class="season-episode-badge">{{ seasonEpisode }}</div>
        <div
            v-if="ratingColor"
            class="rating-badge"
            :style="{ backgroundColor: ratingColor }"
        >
          {{ vod.streamerRate }}
        </div>
      </div>

      <div class="movie-info">
        <h3 class="title-main">{{ vod.titleMain != null ? vod.titleMain : vod.titleSecond }}</h3>
        <p class="title-second">{{ vod.titleMain != null ? vod.titleSecond : "" }}</p>
        <div class="info-container">
          <span class="info">{{ vod.movieType + " | " + (vod.year ? vod.year : "???") }}</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.movie-card-wrapper {
  position: relative;
  display: block;
  text-decoration: none;
  color: inherit;
}

.movie-card {
  display: block;
  text-decoration: none;
  color: inherit;
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  z-index: 2;
  position: relative;
  cursor: pointer;
  transition: 0.2s ease;
  border-radius: 12px;
  padding: 8px;
  height: 340px;
  background: radial-gradient(rgba(var(--white-rgb)/0.1) 40%, rgba(var(--accent-black-rgb)) 100%);
  word-break: keep-all;
  overflow-wrap: normal;
  white-space: normal;
}

.movie-card-wrapper:hover .movie-card {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.poster-wrapper {
  position: relative;
  aspect-ratio: 3 / 4;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.movie-info {
  padding: 6px 8px 12px;
  position: relative;
  z-index: 2;
}

.title-main {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: var(--white);
  letter-spacing: -0.5px;
  text-transform: uppercase;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.title-second {
  font-size: 12px;
  color: var(--accent-color);
  margin: 0 0 10px 0;
  font-family: 'Courier New', monospace;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-container {
  display: flex;
  font-family: 'Courier New', monospace;
}

.info {
  font-size: 11px;
  color: white;
  border-radius: 4px;
  letter-spacing: 0.1em;
}

.old-school-effect {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.1) 0px,
      rgba(0, 0, 0, 0.1) 2px,
      transparent 3px,
      transparent 4px
  );
  pointer-events: none;
  z-index: 4;
  border-radius: 12px;
}

.rating-badge {
  position: absolute;
  right: 6px;
  bottom: 6px;
  min-width: 24px;
  height: 24px;
  padding: 0 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  z-index: 3;
}

.season-episode-badge {
  position: absolute;
  left: 6px;
  top: 6px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 11px;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.05em;
  z-index: 3;
}
</style>