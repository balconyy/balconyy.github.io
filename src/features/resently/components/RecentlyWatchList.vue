<script setup lang="ts">
import MovieCardShort from "@/components/MovieCardShort.vue";
import {computed, onMounted, ref} from 'vue'
import {Movie} from "@/models/movie";

const {movies} = defineProps<{
  movies: Movie[];
}>();



</script>

<template>
  <h2 class="relations-title">Смотрели недавно</h2>
  <ul class="relations-list" ref="grid">
    <MovieCardShort
        v-for="movie in movies"
        :movie="movie"
        @selectMovie="$emit('selectMovie', $event)"
    />
  </ul>
</template>

<style scoped>

.relations-list {
  display: flex;
  gap: 16px;

  overflow-x: auto;
  overflow-y: hidden;

  padding: 8px 16px;
  margin: 0;

  scrollbar-width: thin;
  scrollbar-color: rgba(var(--accent-dark-rgb)/0.4) transparent;
}


.relations-title {
  position: relative;
  font-size: clamp(16px, 2vw, 28px);
  color: var(--white);
  z-index: 2;
  margin: 0;
  padding: 28px 0 2px 0;
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