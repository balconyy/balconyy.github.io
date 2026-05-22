<template>
  <div class="search-list">
    <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
    />
  </div>
</template>

<script setup lang="ts">

import MovieCard from "./MovieCard.vue";
import {Movie} from "@/models/movie";

defineProps<{
  movies: Movie[];
}>();
</script>

<style scoped>
.search-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
  padding: 24px;

  min-height: 100vh;
}
</style>