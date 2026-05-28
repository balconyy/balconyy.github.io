<script setup>
import emptyPoster from '@/assets/empty-poster.jpg'

defineProps({
  movie: Object
})

function onImgError(e) {
  if (e.target.src !== emptyPoster) {
    e.target.src = emptyPoster
  }
}

</script>


<template>
  <RouterLink :to="{ name: 'movie', params: { kp_id: movie.id}}">
    <div class="movie-card">
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

        <div class="movie-info">
          <h3 class="title-main">{{ movie.titleMain != null ? movie.titleMain : movie.titleSecond }}</h3>
          <p class="title-second">{{ movie.titleMain != null ? movie.titleSecond : "" }}</p>
          <div class="info-container">
            <span class="info">{{ movie.type + " | " + (movie.year !== 'null' ? movie.year : "???") }}</span>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
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
  height: 400px;
  transition: 0.2s ease;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-card:hover .card-inner {
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
  -webkit-line-clamp: 2; /* или 3 */
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


</style>