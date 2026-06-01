<script setup>

import {onMounted, ref} from "vue";

const props = defineProps({
  videoMain: {
    type: String,
    required: true
  },

  imagePressed: {
    type: String,
    required: true
  },

  delay: {
    type: Number,
    default: 5000
  }
})

const pressed = ref(false)
const videoRef = ref(null)

let timer = null

const createTimer = (delay) => {
  return setTimeout(() => {
    if (videoRef == null) return
    play(videoRef.value)
  }, delay)
}

const onDown = () => {
  pressed.value = true
}

const onUp = () => {
  pressed.value = false
  requestAnimationFrame(() => {
    play(videoRef.value)
    restartTimer()
  })
}

const play = (video) => {
  if (!video || document.hidden) return
  video.currentTime = 0
  video.play()
}

const restartTimer = () => {
  clearTimeout(timer)
  timer = createTimer(props.delay)
}

onMounted(() => {
  play(videoRef.value)
})

</script>

<template>
  <section
      class="face-view"
      @mousedown="onDown"
      @mouseup="onUp"
      @mouseleave="onUp"
  >
    <video class="file" v-if="pressed === false " ref="videoRef" muted playsinline
           @ended="restartTimer">
      <source :src="props.videoMain" type="video/webm"/>
    </video>
    <img
        v-else
        class="file"
        :src="props.imagePressed"
        alt="bolvan"
    />
  </section>
</template>

<style scoped>

.file {
  width: 100%;
  height: 100%;
  object-fit: cover;

  backface-visibility: hidden;
  will-change: transform;
  -webkit-user-drag: none;
}
</style>