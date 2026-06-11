<script setup lang="ts">

import {Movie} from "@/models/movie";
import MovieCard from "@/features/search/components/card/MovieCard.vue";
import ErrorScreen from "@/components/ErrorScreen.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

defineProps<{
  movies: Movie[];
  loading: Boolean,
  errorMessage?: string,
}>();

defineEmits(['selectMovie'])
</script>

<template>
  <LoadingScreen v-if="loading"
                 message="Поиск фильмов..."
  />
  <ErrorScreen v-else-if="errorMessage"
               :message="errorMessage"
  />

  <ul v-else-if="movies" class="movie-list">
    <MovieCard
        v-for="movie in movies"
        :movie="movie"
        @selectMovie="$emit('selectMovie', $event)"
    />
  </ul>
</template>

<style scoped>

</style>