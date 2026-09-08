<script setup>

import ErrorScreen from "@/components/ErrorScreen.vue";
import MovieCard from "@/components/MovieCard.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import MovieButton from "@/features/search/components/MovieButton.vue";
import {usePopular} from "@/features/search/composables/usePopular.ts";
import {useGridColumns} from "@/features/search/composables/useGridColumns.ts";
import {computed, onMounted, ref, watch} from "vue";

const {
  popularList,
  error,
  isLoading,
  hasMore,
  getPopular,
} = usePopular()

const VISIBLE_ROWS = 2;

const listRef = ref(null);
const {columnsCount, observe} = useGridColumns(listRef);
const visibleRowsCount = ref(VISIBLE_ROWS);

// Показываем весь пришедший с сервера список в пределах текущего числа запрошенных строк.
// Если реальных данных меньше, чем нужно для полных строк, — просто показываем, что есть,
// остальное место в сетке остаётся пустым (никаких дублей ради заполнения строк)
const visiblePopularList = computed(() => {
  return popularList.value.slice(0, columnsCount.value * visibleRowsCount.value);
});

// Догружает страницы, пока не наберётся достаточно элементов под текущее число строк,
// либо пока сервер не сообщит (через hasMore), что новых фильмов больше нет
async function ensureEnoughCached() {
  while (hasMore.value && popularList.value.length < columnsCount.value * visibleRowsCount.value) {
    await getPopular();
  }
}

async function loadMore() {
  visibleRowsCount.value += VISIBLE_ROWS;
  await ensureEnoughCached();
}

onMounted(async () => {
  await getPopular();
  await ensureEnoughCached();
});

watch(
    () => popularList.value,
    (value) => {
      if (value && value.length) {
        observe();
      }
    },
    {immediate: true}
);

// Число колонок могло измениться (ресайз/первое измерение после рендера) —
// пересчитываем, хватает ли кэша на нужное число строк
watch(columnsCount, () => {
  ensureEnoughCached();
});
</script>

<template>
  <ErrorScreen v-if="error"
               :message="error"
  />

  <div v-else-if="popularList.length > 0">
    <ul ref="listRef" class="movie-list">
      <MovieCard
          v-for="movie in visiblePopularList"
          :key="movie.id"
          :movie="movie"
      />
    </ul>
    <MovieButton v-if="hasMore" text="Ещё" @click="loadMore"/>
  </div>
  <LoadingScreen v-else-if="isLoading"/>
</template>

<style scoped>

</style>