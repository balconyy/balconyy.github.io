<script setup>
import emptyPoster from '@/assets/media/empty-poster.jpg'

let {movie} = defineProps({
  movie: Object,
})

defineEmits(['selectMovie'])

function onImgError(e) {
  if (e.target.src !== emptyPoster) {
    e.target.src = emptyPoster
  }
}


</script>


<template>
  <div class="movie-card" @click="$emit('selectMovie', movie)">
    <div class="old-school-effect"/>
    <div class="card-inner">
      <div class="poster-wrapper">
        <img
            class="poster"
            :src="movie.posterUrl"
            @error="onImgError"
            alt="poster"
        >
      </div>
      <h3 class="title-main">{{ movie.titleMain != null ? movie.titleMain : movie.titleSecond }} {{ movie?.year ? " (" + movie?.year + ")" : '' }}</h3>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  z-index: 2;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}


.card-inner {
  flex: 1;
  position: relative;
  background: radial-gradient(rgba(var(--white-rgb)/0.1) 40%, rgba(var(--accent-black-rgb)) 100%);
  border-radius: 12px;
  padding: 8px;
  height: 180px;
  transition: 0.2s ease;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card:hover .card-inner {
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
}

.poster-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}


.title-main {
  font-size: 13px;
  font-weight: 700;
  margin: 12px 0 0 0;
  color: var(--white);
  letter-spacing: -0.5px;
  text-transform: uppercase;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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


</style>