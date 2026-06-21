<script setup lang="ts">
import MovieCardShort from "@/components/MovieCardShort.vue";
import {Movie} from "@/models/movie";

const {movies} = defineProps<{
  movies: Movie[];
}>();

defineEmits(['selectMovie'])

</script>

<template>
  <h2 class="relations-title">Другие части</h2>
  <ul class="relations-list">
    <MovieCardShort
        v-for="movie in movies"
        :movie="movie"
        @selectMovie="$emit('selectMovie', $event)"
    />
  </ul>
</template>

<style scoped>

.relations-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, 130px);
  justify-content: center;
  gap: 18px;
  padding: 0 30px;
}

.relations-title {
  position: relative;
  font-size: clamp(16px, 2vw, 28px);
  color: var(--white);
  z-index: 2;
  margin: 0;
  padding: 28px 0 16px 0;
  line-height: 1.05;
  font-weight: 800;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  transition: all 0.3s ease;
}
</style>