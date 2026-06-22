<script setup>
import emptyPoster from '@/assets/media/empty-poster.jpg'
import {X} from '@lucide/vue';

let {movie, showDeleteButton} = defineProps({
  movie: Object,
  showDeleteButton: {
    type: Boolean,
    default: false
  }
})

defineEmits(['selectMovie', 'deleteMovie'])

function onImgError(e) {
  if (e.target.src !== emptyPoster) {
    e.target.src = emptyPoster
  }
}


</script>


<template>
  <div class="movie-card" @click="$emit('selectMovie', movie)">
    <button v-if="showDeleteButton"
            class="delete-button" @click.stop="$emit('deleteMovie', movie)">
      <X color="#f1f"/>
    </button>
    <div class="old-school-effect"/>
    <div class="poster-wrapper">
      <img
          class="poster"
          :src="movie.posterUrl"
          @error="onImgError"
          alt="poster"
      >
    </div>

    <div class="movie-info">
      <h3 class="title-main">{{ movie.titleMain != null ? movie.titleMain : movie.titleSecond }}</h3>
      <p class="title-second">{{ movie.titleMain != null ? movie.titleSecond : "" }}</p>
      <div class="info-container">
        <span class="info">{{ movie.type + " | " + (movie.year !== 'null' ? movie.year : "???") }}</span>
      </div>
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
  transition: 0.2s ease;
  border-radius: 12px;
  padding: 8px;
  height: 400px;
  background: radial-gradient(rgba(var(--white-rgb)/0.1) 40%, rgba(var(--accent-black-rgb)) 100%);
}

.movie-card:hover {
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

.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 20;

  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.75);
  cursor: pointer;

  opacity: 0;
  transform: scale(0.8);

  transition: opacity 0.2s ease,
  transform 0.2s ease,
  background 0.2s ease;
}

.movie-card:hover .delete-button {
  opacity: 1;
  transform: scale(1);
}

.delete-button:hover {
  background: rgba(0, 0, 0, 0.95);
}

.delete-button:active {
  transform: scale(0.9);
}


</style>