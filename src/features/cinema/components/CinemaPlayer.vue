<script setup lang="ts">
import {computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {QUALITY_LEVELS, useCinemaPlayer} from "@/features/cinema/composables/useCinemaPlayer";
import CinemaControls from "@/features/cinema/components/CinemaControls.vue";
import NavBar from "@/components/navigation/NavBar.vue";

const props = defineProps<{
  src: string
  currentTime: number
}>()

const emit = defineEmits<{ sync: [] }>()

const frameRef = ref<HTMLElement | null>(null)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeSrc = ref<string | undefined>(undefined)

const playerOrigin = computed(() => {
  try {
    return new URL(iframeSrc.value ?? '').origin
  } catch {
    return undefined
  }
})

const {
  state,
  attach,
  detach,
  on,
  play,
  pause,
  setVolume,
  setQuality,
  seekTo,
  reset,
} = useCinemaPlayer(iframeRef, playerOrigin)

const hovering = ref(false)
const isPlaying = ref(true)

function togglePlay() {
  if (isPlaying.value) {
    pause()
  } else {
    play()
    emit('sync')
  }
}

const volumeLevel = ref(1)

watch(() => state.value.volume, (v) => {
  volumeLevel.value = v
})

function onVolumeChange(value: number) {
  volumeLevel.value = value
  setVolume(value)
}

const isFullscreen = ref(false)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    frameRef.value?.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

function onFullscreenChange() {
  isFullscreen.value = document.fullscreenElement === frameRef.value
}


const QUALITIES = QUALITY_LEVELS
    .map((label, index) => ({label, index}))
    .slice()
    .reverse()

// null, пока плеер не прислал текущее качество
const currentQualityLabel = ref<string | null>(null)

// Ожидаем подтверждение выбранного качества от плеера.
const pendingQualityIndex = ref<number | null>(null)


function selectQuality(index: number) {
  pendingQualityIndex.value = index
  currentQualityLabel.value = QUALITY_LEVELS[index]
  setQuality(index)
}


watch(
    () => props.src,
    (newSrc) => {

      iframeSrc.value = newSrc
      currentQualityLabel.value = null
      pendingQualityIndex.value = null
    }
)

watch(
    () => props.currentTime,
    (newTime) => {
      seekTo(newTime)
    }
)

onBeforeMount(() => {
  attach()
  iframeSrc.value = props.src
})

onMounted(() => {
  document.addEventListener(
      "fullscreenchange",
      onFullscreenChange
  )


  on("*", (e) => {
    console.log(e)
  })

  on("quality", (e) => {
    emit("sync")
  })

  on("inited", () => {
    play()
    seekTo(props.currentTime)
  })

  on("vast_finish", () => {
    play()
    setVolume(state.value.volume)
    seekTo(props.currentTime)
  })

  on("play", (e) => {
    isPlaying.value = true
  })
  on("pause", (e) => {
    isPlaying.value = false
  })
})

onBeforeUnmount(() => {
  detach()
  document.removeEventListener(
      "fullscreenchange",
      onFullscreenChange
  )
})
</script>

<template>
  <div class="cinema-container">
    <div
        ref="frameRef"
        class="cinema-frame"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
    >
      <NavBar class="cinema-navigation" v-if="hovering" :showCinema="false"/>
      <iframe
          ref="iframeRef"
          :src="iframeSrc"
          class="cinema-iframe"
          referrerpolicy="origin"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          tabindex="-1"
          data-init="true"
          :style="{ userSelect: 'none' }"
      />

      <CinemaControls
          class="cinema-controls"
          :hovering="hovering"
          :volume="volumeLevel"
          :isPlaying="isPlaying"
          :isFullscreen="isFullscreen"
          :qualities="QUALITIES"
          :currentQualityLabel="currentQualityLabel"
          :pendingQualityIndex="pendingQualityIndex"
          @volumeChange="onVolumeChange"
          @togglePlay="togglePlay"
          @toggleFullscreen="toggleFullscreen"
          @qualitySelect="selectQuality"
      />
    </div>
  </div>
</template>

<style scoped>
.cinema-container {
  flex: 0 0 70%;
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cinema-navigation {
  position: absolute;
  top: 8px;
  left: 8px;
}

.cinema-frame {
  position: relative;
  flex: 1;
  width: 100%;
  background: #0a0a0a;
  overflow: hidden;
}

.cinema-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  pointer-events: none;
}

.cinema-controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 16px;

}
</style>