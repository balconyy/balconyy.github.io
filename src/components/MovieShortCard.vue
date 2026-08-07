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
  <div class="movie-card" @click="$emit('selectMovie', movie)" :title="movie.titleMain">
    <div class="old-school-effect"/>
    <img
        class="poster"
        :src="movie.posterUrl"
        @error="onImgError"
        alt="poster"
    >

    <h3 class="title-main">{{ movie.titleMain != null ? movie.titleMain : movie.titleSecond }}
      {{ movie?.year ? " (" + movie?.year + ")" : '' }}</h3>
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
  transition: 0.2s ease;
  width: 140px;
  height: 178px;
  border-radius: 12px;
  padding: 8px;
  background: radial-gradient(rgba(var(--white-rgb)/0.1) 40%, rgba(var(--accent-black-rgb)) 100%);
}


.movie-card:hover {
  transform: scale(1.05);
}

.movie-card:hover {
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
}


.poster {
  display: block;
  margin: 0 auto;
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}


.title-main {
  font-size: 12px;
  font-weight: 700;
  margin: 6px 0 0 0;
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