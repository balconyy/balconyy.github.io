<script setup lang="ts">
import {computed} from 'vue'
import {ChevronLeft, ChevronRight} from '@lucide/vue';
import {BoostyMovieCardDto} from "@/data/dto/vod/boostyMovieCardDto";
import ErrorScreen from "@/components/ErrorScreen.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import VodMovieCard from "@/features/streamer/components/vods/VodMovieCard.vue";

const props = defineProps<{
  vods: BoostyMovieCardDto[]
  page: number
  loading?: boolean
  errorMessage?: string
  hasNextPage?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

type ListEntry =
    | { type: 'separator'; key: string; label: string }
    | { type: 'vod'; key: string; vod: BoostyMovieCardDto }

// Новые записи сверху. Если бэкенд отдаёт старые записи первыми,
// поменяйте сортировку на (a, b) => a.dateTimestamp - b.dateTimestamp
const groupedVods = computed<ListEntry[]>(() => {
  const sorted = [...props.vods].sort((a, b) => b.dateTimestamp - a.dateTimestamp)
  const entries: ListEntry[] = []
  let lastKey: string | null = null

  for (const vod of sorted) {
    // dateTimestamp приходит с бэкенда как обычный JS timestamp (миллисекунды)
    const date = new Date(vod.dateTimestamp)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`

    if (monthKey !== lastKey) {
      entries.push({
        type: 'separator',
        key: monthKey,
        label: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`
      })
      lastKey = monthKey
    }

    entries.push({type: 'vod', key: `${vod.postId}-${vod.vid}`, vod})
  }

  return entries
})

function goToPage(newPage: number) {
  if (newPage < 1) return
  emit('update:page', newPage)
}
</script>

<template>
  <LoadingScreen v-if="loading" message="Загрузка записей..."/>
  <ErrorScreen v-else-if="errorMessage" :message="errorMessage"/>

  <div v-else class="vod-movie-list-wrapper">
    <ul class="vod-movie-list">
      <template v-for="entry in groupedVods" :key="entry.key">
        <li v-if="entry.type === 'separator'" class="date-separator">
          <span class="date-separator-line"/>
          <span class="date-separator-label">{{ entry.label }}</span>
          <span class="date-separator-line"/>
        </li>
        <li v-else class="vod-item">
          <VodMovieCard :vod="entry.vod"/>
        </li>
      </template>
    </ul>

    <div class="pagination">
      <button
          class="page-button"
          :disabled="page <= 1"
          @click="goToPage(page - 1)"
      >
        <ChevronLeft :size="18"/>
      </button>
      <span class="page-label">{{ page }}</span>
      <button
          class="page-button"
          :disabled="hasNextPage === false"
          @click="goToPage(page + 1)"
      >
        <ChevronRight :size="18"/>
      </button>
    </div>
  </div>
</template>

<style scoped>
.vod-movie-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.vod-movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.vod-item {
  display: contents;
}

.date-separator {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
}

.date-separator-line {
  flex: 1;
  height: 1px;
  background: rgba(var(--white-rgb) / 0.2);
}

.date-separator-label {
  font-size: 12px;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.08em;
  color: rgba(var(--white-rgb) / 0.6);
  white-space: nowrap;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.page-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.75);
  color: var(--white);
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;
}

.page-button:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.95);
}

.page-button:disabled {
  opacity: 0.35;
  cursor: default;
}

.page-label {
  font-size: 14px;
  font-family: 'Courier New', monospace;
  color: var(--white);
  min-width: 20px;
  text-align: center;
}
</style>