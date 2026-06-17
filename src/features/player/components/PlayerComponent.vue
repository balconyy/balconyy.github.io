<template>
  <ErrorScreen v-if="errorMessage" :message="errorMessage"/>

  <template v-else>
    <PlayerSelectorBar
        :selected-label="selectedPlayerLabel"
        :show-source-button="showSourceButton"
        @open-player-modal="openPlayerModal"
        @open-source-modal="openSourceModal"
    />
    <!-- Модальное окно выбора плеера -->
    <PlayerModal
        v-if="showPlayerModal"
        :players="playersInternal"
        :selected-player="selectedPlayerInternal"
        @close="closePlayerModal"
        @select="handlePlayerSelect"
    />

    <PlayerSourceModal
        v-if="showSourceModal"
        :candidates="sourceCandidates"
        :loading="sourceLoading"
        :error="sourceError"
        @close="closeSourceModal"
        @select="applySourceCandidate"
    />

    <!-- Единый контейнер плеера -->
    <div class="player-container-wrapper">
      <div
          ref="containerRef"
          :class="['player-container', { 'theater-mode': theaterMode }]"
          :style="!theaterMode ? containerStyle : {}"
      >
        <div class="iframe-wrapper" :style="!theaterMode ? iframeWrapperStyle : {}">
          <iframe
              :key="iframeKey"
              v-show="!iframeLoading && selectedPlayerInternal?.iframe"
              ref="playerIframe"
              :src="selectedPlayerInternal?.iframe"
              frameborder="0"
              allowfullscreen
              webkitallowfullscreen
              class="responsive-iframe"
              :class="{
            'theater-mode-unlock': closeButtonVisible,
            'theater-mode-lock': theaterMode,
            dimmed: dimmingEnabled
          }"
              @load="onIframeLoad"
              @error="onIframeError"
          ></iframe>
          <SpinnerLoading
              v-if="iframeLoading && !playersEmptyMessage"
              class="player-loading-spinner"
              :text="`Загружается плеер: ${selectedPlayerInternal ? getProviderDisplayName(selectedPlayerInternal) : 'Загружается список плееров'}\nЕсли плеер не грузится, то смените плеер выше или включите VPN`"
          />
          <div v-else-if="playersEmptyMessage" class="player-empty-state">
            <p>{{ playersEmptyMessage }}</p>
            <button v-if="playersButtonIsActive" @click="fetchPlayers">Обновить</button>
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
                  @click="setAspectRatio(ratio)"
              >
                {{ ratio }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import {defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'

import ErrorScreen from '@/components/ErrorScreen.vue'
import SpinnerLoading from '@/components/SpinnerLoading.vue'
import {usePlayerLayout} from '@/features/player/composables/usePlayerLayout'
import {usePlayerSources} from '@/features/player/composables/usePlayerSources'
import {usePlayerStore} from '@/store/player'
import PlayerModal from '@/features/player/components/PlayerModal.vue'
import PlayerSelectorBar from '@/features/player/components/PlayerSelectorBar.vue'
import {getProviderDisplayName} from '@/utils/playerUtils'
import {Fullscreen} from '@lucide/vue';

const PlayerSourceModal = defineAsyncComponent(
    () => import('@/features/player/components/PlayerSourceModal.vue')
)

const playerStore = usePlayerStore()
const route = useRoute()
const kinopoiskId = route.params.kpId


const iframeLoading = ref(true)
const playerIframe = ref(null)
const containerRef = ref(null)
const iframeKey = ref(0)

const {
  theaterMode,
  closeButtonVisible,
  closeButtonWasVisible,
  aspectRatio,
  isCentered,
  dimmingEnabled,
  containerStyle,
  iframeWrapperStyle,
  aspectRatios,
  updateScaleFactor,
  centerPlayer,
  toggleTheaterMode,
  setAspectRatio,
  cycleAspectRatio,
  cleanupPlayerLayout
} = usePlayerLayout({
  playerStore,
  containerRef,
  playerIframe
})

const {
  playersInternal,
  selectedPlayerInternal,
  showPlayerModal,
  showSourceModal,
  sourceCandidates,
  sourceLoading,
  sourceError,
  errorMessage,
  errorCode,
  playersEmptyMessage,
  playersButtonIsActive,
  showSourceButton,
  selectedPlayerLabel,
  fetchPlayers,
  openPlayerModal,
  closePlayerModal,
  openSourceModal,
  closeSourceModal,
  applySourceCandidate,
} = usePlayerSources({
      kinopoiskId
    }
)

const activeTooltip = ref(null)
const tooltipHovered = ref(false)
let hideTimeout = null

const updateTooltipPosition = (tooltipName) => {
  const container = document.querySelector(`[data-tooltip-container="${tooltipName}"]`)
  const tooltip = document.querySelector(`[data-tooltip="${tooltipName}"]`)
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

const showTooltip = (tooltipName) => {
  activeTooltip.value = tooltipName
  tooltipHovered.value = false
  clearTimeout(hideTimeout)
  nextTick(() => {
    updateTooltipPosition(tooltipName)
  })
}

const tryHideTooltip = () => {
  if (!tooltipHovered.value) {
    hideTimeout = setTimeout(() => {
      activeTooltip.value = null
    }, 300)
  }
}

const keepTooltipVisible = () => {
  tooltipHovered.value = true
  clearTimeout(hideTimeout)
}

const hideTooltip = () => {
  tooltipHovered.value = false
  activeTooltip.value = null
}


const onIframeLoad = () => {
  iframeLoading.value = false
  window.iframeLoadTime = Date.now()
}

const handlePlayerSelect = (player) => {
  if (selectedPlayerInternal.value?.name === player.value) {
    closePlayerModal()
    return
  }

  selectedPlayerInternal.value = player
  iframeLoading.value = true


  closePlayerModal()
}

watch(selectedPlayerInternal, (newVal) => {
  if (newVal) {
    iframeLoading.value = true
    //Костыль для не попадания iframe в backstack
    iframeKey.value++
  }
})


onMounted(() => {
  iframeLoading.value = true
  fetchPlayers()
  console.log("ULOO")
  updateScaleFactor()
  if (isCentered.value) centerPlayer()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScaleFactor)
  window.removeEventListener('resize', updateTooltipPosition)
  cleanupPlayerLayout()
})
</script>

<style scoped src="@/assets/player-component.scss"/>
