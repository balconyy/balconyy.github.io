<script setup lang="ts">
import {computed, ref} from "vue";
import {Maximize, Minimize, Pause, Play, Proportions, Signal, Volume2, VolumeX} from "@lucide/vue";

interface QualityOption {
  label: string
  index: number
}

const props = defineProps<{
  hovering: boolean
  volume: number
  isPlaying: boolean
  isFullscreen: boolean
  qualities: QualityOption[]
  currentQualityLabel: string | null
  pendingQualityIndex: number | null
}>()

const emit = defineEmits<{
  (e: 'volume-change', value: number): void
  (e: 'toggle-play'): void
  (e: 'toggle-fullscreen'): void
  (e: 'quality-select', index: number): void
}>()

const volumeOpen = ref(false)
const qualityOpen = ref(false)
const anyPopupOpen = computed(() => volumeOpen.value || qualityOpen.value)
const visible = computed(() => props.hovering || anyPopupOpen.value)

// ---------- громкость ----------
const volumeLevel = computed<number>({
  get: () => props.volume,
  set: (v) => emit('volume-change', v),
})

function selectQuality(index: number) {
  emit('quality-select', index)
  qualityOpen.value = false
}
</script>

<template>
  <transition name="cinema-controls-fade">
    <div v-show="visible" class="cinema-controls">
      <!-- Звук -->
      <div class="ctrl-item" @mouseenter="volumeOpen = true" @mouseleave="volumeOpen = false">
        <button type="button" class="ctrl-btn">
          <Volume2 v-if="volumeLevel > 0" :size="18" :stroke-width="1.8"/>
          <VolumeX v-else :size="18" :stroke-width="1.8"/>
        </button>

        <div v-show="volumeOpen" class="ctrl-popup-anchor">
          <div class="volume-popup">
            <div class="volume-value">{{ Math.round(volumeLevel * 100) }}%</div>
            <input
                v-model.number="volumeLevel"
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="volume-slider"
            >
          </div>
        </div>
      </div>

      <div class="ctrl-item">
        <button
            type="button"
            class="ctrl-btn"
            :title="isFullscreen ? 'Свернуть' : 'На весь экран'"
            @click="emit('toggle-fullscreen')"
        >
          <Minimize v-if="isFullscreen" :size="18" :stroke-width="1.8"/>
          <Maximize v-else :size="18" :stroke-width="1.8"/>
        </button>
      </div>

      <div class="ctrl-item">
        <button type="button" class="ctrl-btn" :title="isPlaying ? 'Пауза' : 'Старт'" @click="emit('toggle-play')">
          <Pause v-if="isPlaying" :size="18" fill="currentColor" :stroke-width="0"/>
          <Play v-else :size="18" fill="currentColor" :stroke-width="0"/>
        </button>
      </div>

      <div class="ctrl-item" @mouseenter="qualityOpen = true" @mouseleave="qualityOpen = false">
        <button type="button" class="ctrl-btn ctrl-btn--label">
          {{ currentQualityLabel ?? 'Качество' }}
        </button>

        <div v-show="qualityOpen" class="ctrl-popup-anchor">
          <div class="quality-popup">
            <button
                v-for="q in qualities"
                :key="q.index"
                type="button"
                class="ctrl-option"
                :class="{
                  'is-active': currentQualityLabel === q.label,
                  'is-pending': pendingQualityIndex === q.index,
                }"
                @click="selectQuality(q.index)"
            >{{ q.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.cinema-controls {
  display: flex;
  align-items: center;
  margin: 0 auto;
  gap: 8px;
  padding: 8px;
  background: rgba(23, 23, 29, 0.92);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  color: #e8e8ec;
  pointer-events: auto;
  width: fit-content;
}

.cinema-controls-fade-enter-active,
.cinema-controls-fade-leave-active {
  transition: opacity 0.15s ease;
}

.cinema-controls-fade-enter-from,
.cinema-controls-fade-leave-to {
  opacity: 0;
}

.ctrl-item {
  position: relative;
}

.ctrl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  background: #1f1f26;
  color: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.ctrl-btn:hover {
  background: #26262f;
  border-color: rgba(255, 255, 255, 0.16);
}

.ctrl-btn--label {
  width: auto;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.ctrl-btn.is-active {
  background: #7c5cfa;
  border-color: #7c5cfa;
  color: #fff;
}

.ctrl-btn.is-active:hover {
  background: #8a6dfb;
}

.ctrl-popup-anchor {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: 1px;
  z-index: 20;
}

.quality-popup {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 96px;
  padding: 6px;
  background: #1c1c23;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
}

.ctrl-option {
  border: none;
  background: transparent;
  color: #d8d8de;
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 13px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.ctrl-option:hover {
  background: rgba(255, 255, 255, 0.06);
}

.ctrl-option.is-active {
  background: #7c5cfa;
  color: #fff;
}

.ctrl-option.is-pending {
  opacity: 0.6;
}

.ctrl-option.is-unavailable {
  opacity: 0.35;
  text-decoration: line-through;
}

.volume-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  padding: 12px 10px;
  background: #1c1c23;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

.volume-value {
  font-size: 11px;
  color: #a9a9b3;
  margin-bottom: 8px;
}

.volume-slider {
  width: 100px;
  height: 80px;
  margin: 0;
  accent-color: #7c5cfa;
  transform: rotate(-90deg);
  cursor: pointer;
}
</style>