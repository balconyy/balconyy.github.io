<script setup lang="ts">
import {computed, ref, toRef, type Component} from 'vue'

import SpinnerLoading from '@/components/SpinnerLoading.vue'
import {usePlayerLayout} from '@/features/player/composables/usePlayerLayout'
import {useMediaLoadingState} from '@/features/player/composables/useMediaLoadingState'
import {PlayerOverlay} from "@/features/player/contract/playerOverlay";

// Контейнер отвечает только за раскладку, спиннер и пустое состояние.
// Что рендерить и какие кнопки положить поверх — приходит извне.
interface Props {
  mediaComponent: Component
  mediaId?: string | null
  mediaUrl?: string | null
  loadingText?: string
  emptyMessage?: string
  isLoading?: boolean
  overlay?: PlayerOverlay | null
}

const props = withDefaults(defineProps<Props>(), {
  mediaId: null,
  mediaUrl: null,
  loadingText: 'Загрузка...',
  emptyMessage: '',
  isLoading: false,
  overlay: null
})

const {
  isMediaLoading,
  isMediaSwitching,
  mediaKey,
  onMediaLoaded
} = useMediaLoadingState(toRef(props, 'mediaUrl'), toRef(props, 'mediaId'))

const containerRef = ref<HTMLElement | null>(null)
const isPointerOver = ref(false)

const {
  theaterMode,
  closeButtonVisible,
  containerStyle,
  iframeWrapperStyle,
} = usePlayerLayout(containerRef)

const isMediaReady = computed<boolean>(
    () => !!props.mediaUrl && !props.isLoading && !isMediaLoading.value
)

const isEmpty = computed<boolean>(() => !isMediaReady.value && !!props.emptyMessage)
</script>

<template>
  <div class="player-container-wrapper">
    <div
        ref="containerRef"
        :class="['player-container', { 'theater-mode': theaterMode }]"
        :style="!theaterMode ? containerStyle : {}"
    >
      <div
          class="iframe-wrapper"
          :style="!theaterMode ? iframeWrapperStyle : {}"
          @pointerenter="isPointerOver = true"
          @pointerleave="isPointerOver = false"
      >
        <component
            :is="mediaComponent"
            :key="mediaKey"
            v-show="isMediaReady"
            :src="mediaUrl"
            class="responsive-iframe"
            :class="{
              'theater-mode-unlock': closeButtonVisible,
              'theater-mode-lock': theaterMode
            }"
            @loaded="onMediaLoaded"
            @error="(event: Event) => console.error('media error', event)"
        />

        <div
            v-if="overlay && isMediaReady"
            :class="['media-overlay-layer', { 'is-visible': isPointerOver }]"
        >
          <component
              :is="overlay.component"
              v-bind="overlay.props"
              v-on="overlay.listeners ?? {}"
          />
        </div>

        <div v-if="isMediaReady && isMediaSwitching" class="media-switching-badge">
          Переключение...
        </div>

        <div v-if="isEmpty" class="player-empty-state">
          <p>{{ emptyMessage }}</p>
        </div>
        <SpinnerLoading
            v-else-if="!isMediaReady"
            class="player-loading-spinner"
            :text="loadingText"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-container-wrapper {
  width: 70%;
  margin: 0 auto;
  color: #fff;
}

.player-container {
  width: 100%;
  transition: max-width 0.3s ease-in-out,
  max-height 0.3s ease-in-out;
  overflow: hidden;
  border-radius: 10px;
  background: #050505;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
}

.iframe-wrapper {
  transition: padding-top 0.3s ease-in-out,
  transform 0.3s ease-in-out;
  width: 100%;
  overflow: hidden;
  border-radius: inherit;
}

.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  z-index: 4;
}

.responsive-iframe.dimmed {
  z-index: 7;
}

.player-loading-spinner {
  white-space: pre-line;
}

.player-empty-state {
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  background: rgba(30, 30, 30, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

.player-empty-state p {
  margin: 0;
  line-height: 1.45;
}

.player-empty-state button {
  border: 0;
  border-radius: 6px;
  padding: 10px 16px;
  background: var(--accent-color);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.player-empty-state button:hover {
  background: var(--accent-hover);
}

.media-overlay-layer {
  position: absolute;
  inset: 0;
  z-index: 5;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.18s ease-in-out, visibility 0.18s;
  pointer-events: none;
}

.media-overlay-layer.is-visible {
  opacity: 1;
  visibility: visible;
}

/* На тач-устройствах наведения не бывает — там кнопки видны всегда. */
@media (hover: none) {
  .media-overlay-layer {
    opacity: 1;
    visibility: visible;
  }
}

.media-switching-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  padding: 6px 10px;
  border-radius: 5px;
  background: rgba(20, 20, 20, 0.72);
  color: #fff;
  font-size: 13px;
  pointer-events: none;
}
</style>