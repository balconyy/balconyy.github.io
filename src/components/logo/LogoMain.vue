<script setup>
import bolvanWebm from '@/assets/media/bolvan.webm'
import blinkWebm from '@/assets/media/blink.webm'
import zaebPng from '@/assets/media/zaeb.png'
import FaceView from "@/components/logo/FaceView.vue";

const question = "-Эээ... бэлкони?"


</script>

<template>
  <section class="logo-main">
    <div class="search-block">
      <div class="upper-block">
        <p class="question">
          <span v-for="letter in question">{{ letter }}</span>
        </p>
        <FaceView class="face secondary" :video-main="bolvanWebm" :image-pressed="zaebPng"/>
      </div>

      <div class="main-block">
        <FaceView class="face main" :video-main="blinkWebm" :image-pressed="zaebPng"/>
        <h1 class="titles-container">
          <span class="balcony-title">Balcony</span>
          <span class="sub-title">Именно Balcony</span>
        </h1>
      </div>
    </div>
  </section>
</template>

<style scoped>

.logo-main {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  position: relative;
  margin: auto;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0 12px 0;
}

.search-block {
  position: relative;
  z-index: 2;
}

.upper-block {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 12px -48px;
}

.question {
  gap: 4px;
  display: flex;
  letter-spacing: 0.035em;
  color: var(--accent-dark);
}

.question span {
  display: inline-block;
  font-size: clamp(10px, 2vw, 24px);
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
  gap: 12px;
}

.titles-container {
  margin: 0;
  display: flex;
  flex-direction: column;
  line-height: 0.85;
}

.balcony-title {
  font-size: clamp(78px, 8vw, 108px);
  font-weight: 900;
  letter-spacing: -0.095em;
  color: white;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.15);
}

.sub-title {
  margin-left: 4px;
  margin-top: 4px;
  font-size: clamp(10px, 2vw, 21px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--accent-dark);
}

.face.secondary {
  overflow: hidden;
  position: relative;
  width: clamp(24px, 6vw, 36px);
  aspect-ratio: 1 / 1;
}

.face.main {
  margin: auto;
  width: clamp(64px, 8vw, 82px);
  aspect-ratio: 1 / 1;
  filter: drop-shadow(0px 8px 20px rgba(var(--white-rgb) / 0.12));
}


</style>