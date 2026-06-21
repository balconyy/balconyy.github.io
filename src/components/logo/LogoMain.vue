<script setup>
import bolvanWebm from '@/assets/media/bolvan.webm'
import blinkWebm from '@/assets/media/blink.webm'
import zaebPng from '@/assets/media/zaeb.png'
import FaceView from "@/components/logo/FaceView.vue";

const question = "-Эээ... бэлкони?"


</script>

<template>
  <div class="logo-main">
    <div class="upper-block">
      <p class="question">
        <span v-for="letter in question">{{ letter }}</span>
        <FaceView class="face secondary" :videoMain="bolvanWebm" :imagePressed="zaebPng"/>
      </p>
    </div>

    <div class="main-block">
      <div class="circle-shadow"/>
      <FaceView class="face main" :videoMain="blinkWebm" :imagePressed="zaebPng"/>
      <div class="titles-container">
        <h1 class="balcony-title">Balcony</h1>
        <h2 class="sub-title">Именно Balcony</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>

.logo-main {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  position: relative;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12px 0 12px 0;
  gap: 8px;
  z-index: 2;
}

.upper-block {
  display: flex;
  justify-content: center;
}

.question {
  position: relative;
  left: -8%;
  display: flex;
  letter-spacing: 0.035em;
  color: var(--accent-dark);
  gap: 4px;

}

.question span {
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

.face.secondary {
  overflow: hidden;
  position: relative;
  width: clamp(24px, 6vw, 36px);
  aspect-ratio: 1 / 1;
  margin-left: 10px;
}


.main-block {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.titles-container {
  flex-direction: column;
  line-height: 0.85;
}

.balcony-title {
  font-size: clamp(78px, 8vw, 108px);
  font-weight: 900;
  letter-spacing: -0.095em;
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.25);
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

.face.main {
  position: relative;
  width: clamp(64px, 8vw, 82px);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
}

.face.main::before {
  content: "";
  position: absolute;

  width: 80%;
  height: 80%;

  inset: 0;
  margin: auto;

  border-radius: 50%;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
  z-index: -1;

}



</style>