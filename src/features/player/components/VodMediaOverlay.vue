<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {ExternalLink} from '@lucide/vue'

import type {BoostyVodDto} from '@/data/dto/vod/boostyVodDto'

interface Props {
  qualities: BoostyVodDto[]
  currentQuality: string | null
  sourceUrl: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'change-quality': [quality: string]
}>()

const rootRef = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)

const qualityLabel = computed<string>(() => props.currentQuality ?? 'Качество')
const hasChoice = computed<boolean>(() => props.qualities.length > 1)

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = (): void => {
  isMenuOpen.value = false
}

const selectQuality = (quality: string): void => {
  closeMenu()
  emit('change-quality', quality)
}

const onDocumentPointerDown = (event: PointerEvent): void => {
  if (!isMenuOpen.value) return
  if (rootRef.value?.contains(event.target as Node)) return
  closeMenu()
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))
</script>

<template>
  <!-- Курсор ушёл с панели — слой всё равно скрывается контейнером,
       поэтому закрываем меню, чтобы оно не всплыло открытым в следующий раз. -->
  <div ref="rootRef" class="media-overlay" @pointerleave="closeMenu">
    <a
        v-if="sourceUrl"
        class="overlay-btn overlay-link"
        :href="sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
    >
      <ExternalLink :size="15"/>
      Пост
    </a>

    <div v-if="hasChoice" class="overlay-control">
      <button
          class="overlay-btn"
          type="button"
          aria-label="Качество видео"
          :aria-expanded="isMenuOpen"
          @click="toggleMenu"
      >
        {{ qualityLabel }}
      </button>

      <ul v-if="isMenuOpen" class="quality-menu">
        <li v-for="item in qualities" :key="item.quality">
          <button
              type="button"
              :class="['quality-item', { active: item.quality === currentQuality }]"
              @click="selectQuality(item.quality)"
          >
            {{ item.quality }}
          </button>
        </li>
      </ul>
    </div>

  </div>
</template>

<style scoped>
/* Панель не перехватывает клики мимо кнопок, иначе ломается управление видео. */
.media-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  pointer-events: none;
}

.overlay-control {
  position: relative;
  pointer-events: auto;
}

.overlay-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 11px;
  background: rgba(20, 20, 20, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s ease-in-out, border-color 0.2s ease-in-out;
  pointer-events: auto;
}

.overlay-btn:hover {
  background: var(--accent-color);
  border-color: var(--accent-color);
}

.overlay-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 5px var(--accent-color);
}

.quality-menu {
  position: absolute;
  top: calc(100%);
  right: 0;
  min-width: 96px;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: rgba(28, 28, 28, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 5px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
}

.quality-item {
  width: 100%;
  padding: 8px 10px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}

.quality-item:hover {
  background: var(--accent-transparent);
}

.quality-item.active {
  background: var(--accent-color);
}

@media (max-width: 480px) {
  .media-overlay {
    top: 6px;
    right: 6px;
    gap: 6px;
  }

  .overlay-btn {
    padding: 6px 9px;
    font-size: 13px;
  }
}
</style>