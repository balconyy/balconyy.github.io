<script setup>
import {onMounted, ref, watch} from "vue";

import bolvanWebm from '@/assets/bolvan.webm'
import blinkWebm from '@/assets/blink.webm'
import zaebPng from '@/assets/zaeb.png'

const question = "-Эмм... бэлкони?"

const bolvan = ref(null)
const blink = ref(null)

const activeImage = ref(null)

const onDown = (id) => {
  activeImage.value = id
}

const onUp = (event) => {
  activeImage.value = null
  play(event.currentTarget.querySelector('video'))
}

const play = (video) => {
  if (!video) return
  video.currentTime = 0
  video.play()
}

const restartWithDelay = (event) => {
  setTimeout(() => {
    play(event.target)
  }, 3000)
}


onMounted(() => {
  play(bolvan.value)
  play(blink.value)
})

</script>

<template>
  <section class="balcony-block">
    <div class="content">
      <div class="upper-block">
        <p class="question">
          <span v-for="letter in question">{{ letter }}</span>
        </p>
        <div @mousedown="onDown('bolvan', $event)"
             @mouseup="onUp"
             @mouseleave="onUp">
          <video v-if="activeImage !== 'bolvan'" ref="bolvan" class="face secondary" muted playsinline
                 @ended="restartWithDelay">
            <source :src=bolvanWebm type="video/webm"/>
          </video>
          <img
              v-else
              class="face secondary"
              :src="zaebPng"
              alt="bolvan"
          />
        </div>
      </div>

      <div class="main-block">
        <div class="image-main"
            @mousedown="onDown('blink', $event)"
             @mouseup="onUp"
             @mouseleave="onUp">
          <video v-if="activeImage !== 'blink'" ref="blink" class="face main" muted playsinline
                 @ended="restartWithDelay">
            <source :src=blinkWebm type="video/webm"/>
          </video>
          <img
              v-else
              class="face main"
              :src="zaebPng"
              alt="bolvan"
          />
        </div>
        <h1 class="titles-container">
          <span class="balcony-title">Balcony</span>
          <span class="sub-title">Именно Balcony</span>
        </h1>
      </div>
    </div>
  </section>
</template>

<style scoped>

.balcony-block {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  position: relative;
  margin: auto;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.content {
  position: relative;
  z-index: 2;
}

.upper-block {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.question {
  gap: 4px;
  display: flex;
  margin: 0 0 0 -32px;
  letter-spacing: 0.035em;
  color: var(--accent-dark);
}

.question span {
  display: inline-block;
  font-size: clamp(10px, 2vw, 32px);
  font-weight: 200;
  font-style: italic;
}

.question span:nth-child(odd) {
  transform: rotate(-2deg) translateY(-1px);
}

.question span:nth-child(even) {
  transform: rotate(2deg) translateY(1px);
}

.main-block {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.titles-container {
  margin: 0;
  display: flex;
  flex-direction: column;
  line-height: 0.85;
}

.balcony-title {
  font-size: clamp(72px, 9vw, 160px);
  font-weight: 900;
  letter-spacing: -0.095em;
  color: white;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.15);
}

.sub-title {
  margin-left: 7px;
  margin-top: 8px;
  font-size: clamp(4px, 2vw, 28px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-dark);
}

.face.secondary {
  width: clamp(24px, 6vw, 40px);
  aspect-ratio: 1 / 1;
}
.image-main{
  margin: auto;
}

.face.main {
  width: clamp(64px, 12vw, 108px);
  aspect-ratio: 1 / 1;
  filter: drop-shadow(0px 8px 20px rgba(var(--white-rgb) / 0.12));
}


</style>