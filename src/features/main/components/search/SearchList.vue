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

import {Movie} from "@/models/movie";
import MovieCard from "@/features/main/components/card/MovieCard.vue";

defineProps<{
  movies: Movie[];
}>();
</script>

<style scoped>
.search-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 230px);
  justify-content: center;
  align-items: stretch;
  gap: 24px;
  padding: 0;
}
</style>