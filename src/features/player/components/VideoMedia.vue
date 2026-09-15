<script setup lang="ts">
import {ref, watch} from 'vue'

// Контракт медиа-компонента: props { src }, emits { loaded, error }.
interface Props {
  src?: string | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  loaded: []
  error: [event: Event]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

// Смена качества меняет src у того же элемента — браузер перезагружает
// поток с нуля. Снимаем позицию до перерисовки (watch с flush: 'pre')
// и возвращаем её, когда новый поток готов.
const resumeTime = ref(0)
const resumePlaying = ref(false)

watch(
    () => props.src,
    (newSrc, oldSrc) => {
      const video = videoRef.value
      if (!video || !oldSrc || !newSrc || newSrc === oldSrc) return

      resumeTime.value = video.currentTime
      resumePlaying.value = !video.paused
    }
)

const onLoadedData = (): void => {
  const video = videoRef.value

  if (video && resumeTime.value > 0) {
    try {
      video.currentTime = resumeTime.value
      if (resumePlaying.value) void video.play().catch(() => undefined)
    } catch (e) {
      console.error('seek after quality change failed', e)
    }
  }

  resumeTime.value = 0
  resumePlaying.value = false

  emit('loaded')
}
</script>

<template>
  <video
      ref="videoRef"
      :src="src ?? undefined"
      controls
      playsinline
      referrerpolicy="no-referrer"
      @loadeddata="onLoadedData"
      @error="emit('error', $event)"
  />
</template>