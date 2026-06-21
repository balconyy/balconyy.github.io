<script setup lang="ts">
import MovieCardShort from "@/components/MovieCardShort.vue";
import {computed, onMounted, ref} from 'vue'
import {Movie} from "@/models/movie";

const {movies} = defineProps<{
  movies: Movie[];
}>();

const grid = ref(null)
const itemsPerRow = ref(1)


const visibleItems = computed(() =>
    movies.slice(0, itemsPerRow.value)
)

function calculateItemsPerRow() {
  const list = grid.value
  if (!list) return

  const firstChild = list.children[0]
  if (!firstChild) return

  const containerWidth = list.clientWidth
  const itemWidth = firstChild.offsetWidth + 20

  itemsPerRow.value = Math.floor(containerWidth / itemWidth)
}

defineEmits(['selectMovie'])

onMounted(() => {
  calculateItemsPerRow()
  window.addEventListener('resize', calculateItemsPerRow)
})

</script>

<template>
  <h2 class="recently-title">Смотрели недавно</h2>
  <ul class="recently-list" ref="grid">
    <MovieCardShort
        v-for="movie in visibleItems"
        :movie="movie"
        @selectMovie="$emit('selectMovie', $event)"
    />
  </ul>
</template>

<style scoped>

.recently-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  grid-auto-rows: auto;
  justify-content: center;
  align-items: stretch;
  gap: 18px;
  padding: 0 30px;
}

.recently-title {
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