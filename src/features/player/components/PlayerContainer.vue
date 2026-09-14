<script setup lang="ts">
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'

import SpinnerLoading from '@/components/SpinnerLoading.vue'
import {usePlayerLayout} from '@/features/player/composables/usePlayerLayout'
import {Fullscreen} from '@lucide/vue'
import {Player} from "@/models/player";
import {AspectRatio} from "@/models/playerModels";


interface Props {
  selectedPlayer?: Player | null
  playersEmptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  selectedPlayer: null,
  playersEmptyMessage: ''
})


const iframeLoading = ref(true)
const playerIframe = ref<HTMLIFrameElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const iframeKey = ref(0)

const {
  theaterMode,
  closeButtonVisible,
  closeButtonWasVisible,
  aspectRatio,
  containerStyle,
  iframeWrapperStyle,
  aspectRatios,
  updateScaleFactor,
  toggleTheaterMode,
  setAspectRatio,
  cycleAspectRatio,
  cleanupPlayerLayout
} = usePlayerLayout(
    containerRef
)

type TooltipName = 'theater' | 'aspect_ratio'

const activeTooltip = ref<TooltipName | null>(null)
const tooltipHovered = ref(false)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

const updateTooltipPosition = (tooltipName: TooltipName): void => {
  const container = document.querySelector<HTMLElement>(`[data-tooltip-container="${tooltipName}"]`)
  const tooltip = document.querySelector<HTMLElement>(`[data-tooltip="${tooltipName}"]`)
  if (!container || !tooltip) return

  const containerRect = container.getBoundingClientRect()
  const tooltipRect = tooltip.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  if (containerRect.bottom + tooltipRect.height > viewportHeight) {
    tooltip.style.top = 'auto'
    tooltip.style.bottom = '100%'
    tooltip.style.marginTop = '0'
    tooltip.style.marginBottom = '12px'
    tooltip.style.transform = 'translateX(-50%)'
  } else {
    tooltip.style.top = '100%'
    tooltip.style.bottom = 'auto'
    tooltip.style.marginTop = '12px'
    tooltip.style.marginBottom = '0'
    tooltip.style.transform = 'translateX(-50%)'
  }
}

// Fix: the original resize handler was registered with the currently-open
// tooltip's name, not the DOM resize Event object it actually receives.
// Re-derive the open tooltip on every resize instead.
const refreshActiveTooltipPosition = (): void => {
  if (activeTooltip.value) updateTooltipPosition(activeTooltip.value)
}

const showTooltip = (tooltipName: TooltipName): void => {
  activeTooltip.value = tooltipName
  tooltipHovered.value = false
  if (hideTimeout) clearTimeout(hideTimeout)
  nextTick(() => {
    updateTooltipPosition(tooltipName)
  })
}

const tryHideTooltip = (): void => {
  if (!tooltipHovered.value) {
    hideTimeout = setTimeout(() => {
      activeTooltip.value = null
    }, 300)
  }
}

const keepTooltipVisible = (): void => {
  tooltipHovered.value = true
  if (hideTimeout) clearTimeout(hideTimeout)
}

const hideTooltip = (): void => {
  tooltipHovered.value = false
  activeTooltip.value = null
}

const onIframeLoad = (): void => {
  iframeLoading.value = false
  ;(window as Window & { iframeLoadTime?: number }).iframeLoadTime = Date.now()
}

watch(
    () => props.selectedPlayer,
    (newVal) => {
      if (newVal) {
        iframeLoading.value = true
        //Костыль для не попадания iframe в backstack
        iframeKey.value++
      }
    }
)

onMounted(() => {
  iframeLoading.value = true
  updateScaleFactor()

  window.addEventListener('resize', updateScaleFactor)
  window.addEventListener('resize', refreshActiveTooltipPosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScaleFactor)
  window.removeEventListener('resize', refreshActiveTooltipPosition)
  if (hideTimeout) clearTimeout(hideTimeout)
  cleanupPlayerLayout()
})
</script>

<template>
  <div class="player-container-wrapper">
    <div
        ref="containerRef"
        :class="['player-container', { 'theater-mode': theaterMode }]"
        :style="!theaterMode ? containerStyle : {}"
    >
      <div class="iframe-wrapper" :style="!theaterMode ? iframeWrapperStyle : {}">
        <iframe
            :key="iframeKey"
            v-show="!iframeLoading && selectedPlayer?.iframe"
            ref="playerIframe"
            :src="selectedPlayer?.iframe"
            frameborder="0"
            allowfullscreen
            webkitallowfullscreen
            class="responsive-iframe"
            :class="{
              'theater-mode-unlock': closeButtonVisible,
              'theater-mode-lock': theaterMode
            }"
            @load="onIframeLoad"
        ></iframe>
        <SpinnerLoading
            v-if="iframeLoading && !playersEmptyMessage"
            class="player-loading-spinner"
            :text="`Загружается плеер: ${selectedPlayer ? selectedPlayer.name : 'Загружается список плееров'}\nЕсли плеер не грузится, то смените плеер выше или включите VPN`"
        />
        <div v-else-if="playersEmptyMessage" class="player-empty-state">
          <p>{{ playersEmptyMessage }}</p>
        </div>
      </div>

      <!-- Кнопка закрытия в театральном режиме -->
      <button
          v-show="theaterMode"
          class="close-theater-btn"
          :class="{
            visible: closeButtonVisible,
            hiding: theaterMode && !closeButtonVisible && closeButtonWasVisible
          }"
          aria-label="Выйти из театрального режима"
          @click="toggleTheaterMode"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="6" y1="6" x2="18" y2="18"/>
          <line x1="18" y1="6" x2="6" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Кнопки управления -->
    <div v-if="!theaterMode" class="controls">
      <div class="main-controls">
        <div class="tooltip-container" data-tooltip-container="theater">
          <button
              class="theater-mode-btn"
              :aria-label="theaterMode ? 'Выйти из театрального режима' : 'Театральный режим'"
              @mouseenter="showTooltip('theater')"
              @mouseleave="activeTooltip = null"
              @click="toggleTheaterMode"
          >
            <Fullscreen/>
          </button>
          <div v-show="activeTooltip === 'theater'" class="custom-tooltip" data-tooltip="theater">
            {{ theaterMode ? 'Выйти из театрального режима' : 'Театральный режим' }}
            <span class="shortcut-hint">Alt+T</span>
          </div>
        </div>

        <div class="tooltip-container" data-tooltip-container="aspect_ratio">
          <button
              class="aspect-ratio-dropdown-btn"
              aria-label="Изменить соотношение сторон"
              @mouseenter="showTooltip('aspect_ratio')"
              @mouseleave="tryHideTooltip"
              @click="cycleAspectRatio"
          >
            <span class="current-ratio">{{ aspectRatio }}</span>
          </button>
          <div
              v-show="activeTooltip === 'aspect_ratio'"
              class="custom-tooltip advanced-tooltip aspect-ratio-dropdown"
              data-tooltip="aspect_ratio"
              @mouseenter="keepTooltipVisible"
              @mouseleave="hideTooltip"
          >
            <div
                v-for="ratio in aspectRatios"
                :key="ratio"
                class="aspect-ratio-option"
                :class="{ active: aspectRatio === ratio }"
                @click="setAspectRatio(ratio as AspectRatio)"
            >
              {{ ratio }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-container-wrapper {
  width: 70%;
  margin: 0 auto;
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


.tooltip-container {
  position: relative;
  display: inline-block;
}

.custom-tooltip {
  position: absolute;
  left: 50%;
  background-color: rgba(30, 30, 30, 0.95);
  color: #fff;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  white-space: nowrap;
  pointer-events: none;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(8px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.custom-tooltip::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background-color: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  z-index: -1;
}

.custom-tooltip[style*='bottom: 100%']::before {
  bottom: -5px;
  top: auto;
}

.custom-tooltip[style*='top: 100%']::before {
  top: -5px;
  bottom: auto;
}

.tooltip-container:hover .custom-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.advanced-tooltip {
  white-space: normal;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  top: calc(100% + 12px);
  pointer-events: all;
  text-align: center;
  min-width: 240px;
  background-color: rgba(30, 30, 30, 0.98);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.35);
  transform: translateX(-50%) translateY(8px);
}

.advanced-tooltip::before {
  top: -6px;
  width: 12px;
  height: 12px;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 8px auto 18px;
  padding: 6px 8px;
  width: fit-content;
  max-width: min(100%, 920px);
  border-radius: 10px;
  background: rgba(20, 20, 20, 0.92);
  border: 1px solid #333;
  backdrop-filter: blur(8px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
  position: relative;
  z-index: 4;
}

.main-controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.controls button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 6px 8px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.18s ease,
  transform 0.18s ease,
  box-shadow 0.18s ease,
  color 0.18s ease,
  border-color 0.18s ease;
  z-index: 4;
  width: 42px;
  height: 42px;
}

.controls button:hover {
  background-color: color-mix(in srgb, var(--accent-color) 32%, rgba(255, 255, 255, 0.08));
  color: #fff;
  border-color: color-mix(in srgb, var(--accent-color) 58%, rgba(255, 255, 255, 0.14));
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.34),
  0 0 20px color-mix(in srgb, var(--accent-color) 24%, transparent);
}

.controls button:active {
  background-color: color-mix(in srgb, var(--accent-color) 42%, rgba(255, 255, 255, 0.08));
  border-color: color-mix(in srgb, var(--accent-color) 70%, rgba(255, 255, 255, 0.16));
  transform: translateY(0) scale(0.98);
  box-shadow: 0 0 10px color-mix(in srgb, var(--accent-color) 18%, transparent),
  inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.controls button.active {
  background-color: color-mix(in srgb, var(--accent-color) 48%, rgba(255, 255, 255, 0.08));
  border-color: color-mix(in srgb, var(--accent-color) 76%, rgba(255, 255, 255, 0.16));
  color: #fff;
  box-shadow: 0 0 18px color-mix(in srgb, var(--accent-color) 26%, transparent),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.controls .theater-mode-btn.active {
  background: var(--accent-transparent);
  border-color: var(--accent-color);
  color: #fff;
}

.controls .aspect-ratio-dropdown-btn {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.controls .aspect-ratio-dropdown-btn:hover {
  background: color-mix(in srgb, var(--accent-color) 32%, rgba(255, 255, 255, 0.08));
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.34),
  0 0 20px color-mix(in srgb, var(--accent-color) 24%, transparent);
}

.controls .theater-mode-btn:hover {
  background: color-mix(in srgb, var(--accent-color) 32%, rgba(255, 255, 255, 0.08));
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.34),
  0 0 20px color-mix(in srgb, var(--accent-color) 24%, transparent);
}

.controls button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--accent-color) 72%, #fff);
  outline-offset: 2px;
}


.custom-tooltip.advanced-tooltip.aspect-ratio-dropdown {
  min-width: 120px;
  width: 120px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background-color: rgba(30, 30, 30, 0.98);
  border: 1px solid #444;
  border-radius: 8px;
}

.aspect-ratio-option {
  box-sizing: border-box;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.18s ease,
  color 0.18s ease,
  box-shadow 0.18s ease;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  width: 100%;
}

.aspect-ratio-option:hover {
  background-color: var(--accent-color);
  box-shadow: 0 0 8px var(--accent-semi-transparent);
}

.aspect-ratio-option.active {
  background-color: var(--accent-color);
  color: white;
  font-weight: 500;
  box-shadow: none;
}

.aspect-ratio-dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  width: auto;
  min-width: 58px;
}

.current-ratio {
  font-size: 14px;
  font-weight: 500;
}

.shortcut-hint {
  display: block;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 6px;
  font-weight: 400;
}
</style>