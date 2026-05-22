<script setup lang="ts">

import {Movie} from "@/models/movie";
defineProps<{
  movie: Movie;
}>();
</script>

<template>
  <div class="movie-card">
    <img :src="movie.posterUrl" :alt="movie.titleMain" class="poster" />

    <div class="content">
      <div class="titles">
        <h2 class="main-title">{{ movie.titleMain }}</h2>
        <h3 class="second-title">{{ movie.titleSecond }}</h3>
      </div>

      <div class="meta">
        <span class="year">🎬 {{ movie.year }}</span>
        <span class="rating">⭐ {{ movie.ratingKP }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  width: 240px;
  border-radius: 16px;
  overflow: hidden;
  background: radial-gradient(
      circle at top,
      rgba(168, 85, 247, 0.25),
      rgba(15, 0, 30, 0.95)
  ),
  linear-gradient(145deg, #1b062a, #0b0014);

  backdrop-filter: blur(10px);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.movie-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow:
      0 18px 45px rgba(168, 85, 247, 0.4),
      inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.poster {
  width: 100%;
  height: 320px;
  object-fit: cover;
  filter: contrast(1.05) saturate(1.1);
}

.content {
  padding: 14px;
  color: #e9d5ff;
}

.titles {
  margin-bottom: 10px;
}

.main-title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #f5e9ff;
}

.second-title {
  font-size: 12px;
  opacity: 0.75;
  font-style: italic;
  margin-top: 2px;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #c4b5fd;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.rating {
  color: #facc15;
}
</style>