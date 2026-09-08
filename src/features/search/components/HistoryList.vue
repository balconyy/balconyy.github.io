<script setup>

import ErrorScreen from "@/components/ErrorScreen.vue";
import MovieCard from "@/components/MovieCard.vue";
import {useHistory} from "@/features/search/composables/useHistory.ts";
import {computed, onMounted, ref, watch} from "vue";
import MovieButton from "@/features/search/components/MovieButton.vue";
import {useGridColumns} from "@/features/search/composables/useGridColumns.ts";

const {
  history,
  errorMessage,
  getLocalHistory,
  removeMovieFromHistory,
} = useHistory()

const VISIBLE_ROWS = 2;

const listRef = ref(null);
const {columnsCount, observe} = useGridColumns(listRef);
const isExpanded = ref(false);

const maxVisibleItems = computed(() => columnsCount.value * VISIBLE_ROWS);

const hasMore = computed(() => {
  return !!history.value && history.value.length > maxVisibleItems.value;
});

const visibleHistory = computed(() => {
  if (!history.value) return [];
  if (isExpanded.value || !hasMore.value) {
    return history.value;
  }
  return history.value.slice(0, maxVisibleItems.value);
});

function showAll() {
  isExpanded.value = true;
}

onMounted(() => {
  getLocalHistory();
});

watch(
    () => history.value,
    (value) => {
      if (value && value.length) {
        observe();
      }
    },
    {immediate: true}
);
</script>

<template>
  <ErrorScreen v-if="errorMessage"
               :message="errorMessage"
  />

  <div v-else-if="history">
    <ul ref="listRef" class="movie-list">
      <MovieCard
          v-for="movie in visibleHistory"
          :key="movie.id"
          :movie="movie"
          :showDeleteButton="true"
          @deleteMovie="removeMovieFromHistory"
      />
    </ul>
    <MovieButton v-if="hasMore && !isExpanded" text="Показать всю" @click="showAll"
    />
  </div>
</template>

<style scoped>

</style>