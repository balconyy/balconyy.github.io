<script setup lang="ts">
import MovieShortCard from "@/components/MovieShortCard.vue";
import {Relation} from "@/data/dto/movieAddonDTO";

const {movies} = defineProps<{
  movies: Relation[];
}>();

defineEmits(['selectMovie'])

</script>

<template>
  <h2 class="relations-title">Другие части</h2>
  <ul class="relations-list">
    <MovieShortCard
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
  justify-content: center;
  padding: 4px 16px;
}
.relations-title {
  position: relative;
  font-size: clamp(16px, 2vw, 28px);
  color: var(--white);
  z-index: 2;
  margin: 0;
  padding: 10px 0 6px 0;
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