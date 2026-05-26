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
import MovieCard from "@/features/search/components/card/MovieCard.vue";

defineProps<{
  movies: Movie[];
}>();
</script>

<style scoped>
.search-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 226px);
  justify-content: center;
  align-items: stretch;
  gap: 18px;
  padding: 0;
}
</style>