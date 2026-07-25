<script setup lang="ts">
import MovieCardShort from "@/components/MovieCardShort.vue";
import {RecentlyLists} from "@/data/dto/movieAddonDTO";

const {recentlyLists} = defineProps<{
  recentlyLists: RecentlyLists;
}>();

defineEmits(['selectMovie'])
</script>

<template>
  <h2 class="relations-title">Смотрели недавно</h2>
  <div v-if="recentlyLists.movies && recentlyLists.movies.length">
    <h3 class="relations-subtitle">Фильмы</h3>
    <ul class="relations-list" ref="grid">
      <MovieCardShort
          v-for="movie in recentlyLists.movies"
          :movie="movie"
          @selectMovie="$emit('selectMovie', $event)"
      />
    </ul>
  </div>
  <div v-if="recentlyLists.serials && recentlyLists.serials.length">
    <h3 class="relations-subtitle">Сериалы</h3>
    <ul class="relations-list" ref="grid">
      <MovieCardShort
          v-for="movie in recentlyLists.serials"
          :movie="movie"
          @selectMovie="$emit('selectMovie', $event)"
      />
    </ul>
  </div>
</template>

<style scoped>

.relations-list {
  display: flex;
  gap: 16px;

  overflow-x: auto;
  overflow-y: hidden;

  padding: 8px 16px;
  margin: 0 0 32px 0;

  scrollbar-width: thin;
  scrollbar-color: rgba(var(--accent-dark-rgb)/0.4) transparent;
}

.relations-subtitle {
  font-size: clamp(14px, 1.5vw, 20px);
  color: var(--white);
  margin: 8px 16px 0 0;

  text-align: left;
  font-weight: 600;

  padding: 0 32px;
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