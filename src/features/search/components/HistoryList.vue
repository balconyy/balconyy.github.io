<script setup>

import ErrorScreen from "@/components/ErrorScreen.vue";
import MovieCard from "@/components/MovieCard.vue";
import {useHistory} from "@/features/search/composables/useHistory.ts";
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";

const emit = defineEmits(['selectMovie']);

const {
  history,
  errorMessage,
  getLocalHistory,
  removeMovieFromHistory,
} = useHistory()

const VISIBLE_ROWS = 2;

const listRef = ref(null);
const columnsCount = ref(1);
const isExpanded = ref(false);
let resizeObserver = null;

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

function updateColumnsCount() {
  if (!listRef.value) return;
  const template = window.getComputedStyle(listRef.value).gridTemplateColumns;
  const count = template.split(' ').filter(Boolean).length;
  columnsCount.value = count || 1;
}

function showAll() {
  isExpanded.value = true;
}

onMounted(() => {
  getLocalHistory();
});

watch(
    () => history.value,
    async (value) => {
      if (value && value.length) {
        await nextTick();
        updateColumnsCount();

        if (!resizeObserver && listRef.value) {
          resizeObserver = new ResizeObserver(() => updateColumnsCount());
          resizeObserver.observe(listRef.value);
        }
      }
    },
    {immediate: true}
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <ErrorScreen v-if="errorMessage"
               :message="errorMessage"
  />

  <template v-else-if="history">
    <ul ref="listRef" class="movie-list">
      <MovieCard
          v-for="movie in visibleHistory"
          :key="movie.id"
          :movie="movie"
          :showDeleteButton="true"
          @selectMovie="emit('selectMovie', $event)"
          @deleteMovie="removeMovieFromHistory"
      />
    </ul>

    <button
        v-if="hasMore && !isExpanded"
        type="button"
        class="show-all-button"
        @click="showAll"
    >
      Показать все
    </button>
  </template>
</template>

<style scoped>
.show-all-button {
  background: var(--accent-color);
  color: white;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  padding: 12px 20px;
  margin: 12px auto 10px auto;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(var(--accent-color-rgb) / 0.25);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.show-all-button:hover {
  background-color: var(--accent-hover);
  box-shadow: 0 4px 12px rgba(var(--accent-hover-rgb) / 0.3);
}

.show-all-button:active {
  filter: brightness(0.9);
  transform: scale(0.98);
}
</style>