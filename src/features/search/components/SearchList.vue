<script setup lang="ts">

import {computed, ref, toRef, watch} from "vue";
import {MovieKp} from "@/models/movieKp";
import MovieCard from "@/components/MovieCard.vue";
import ErrorScreen from "@/components/ErrorScreen.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import {useGridColumns} from "@/features/search/composables/useGridColumns";

const VISIBLE_ROWS = 2;

const props = defineProps<{
  movies: MovieKp[];
  loading: Boolean,
  errorMessage?: string,
}>();

const moviesRef = toRef(props, 'movies');

const listRef = ref<HTMLElement | null>(null);
const {columnsCount, observe} = useGridColumns(listRef);

// Всегда ровно VISIBLE_ROWS строк, сколько бы колонок ни было на экране — без кнопки разворачивания
const visibleMovies = computed(() => {
  if (!moviesRef.value) return [];
  return moviesRef.value.slice(0, columnsCount.value * VISIBLE_ROWS);
});

watch(
    moviesRef,
    (value) => {
      if (value && value.length) {
        observe();
      }
    },
    {immediate: true}
);
</script>

<template>
  <LoadingScreen v-if="loading"
                 message="Поиск фильмов..."
  />
  <ErrorScreen v-else-if="errorMessage"
               :message="errorMessage"
  />

  <ul v-else-if="movies" ref="listRef" class="movie-list">
    <MovieCard
        v-for="movie in visibleMovies"
        :key="movie.id"
        :movie="movie"
    />
  </ul>
</template>

<style scoped>

</style>