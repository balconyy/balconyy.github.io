<template>
  <a href="https://boosty.to/birdymafia/donate" referrerpolicy="no-referrer">
    <div class="donation-bar">
      <img class="bird-icon" :src="BirdMafiaIcon" alt="bird mafia icon"/>

      <div class="content">
        <p class="title">
          На разработку "<span class="bold">Птичьей мафии</span>"
        </p>

        <div class="bottom-row">
          <div class="progress">
            <div class="fill" :style="{ width: progressPercent + '%' }"></div>
            <div class="progress-text">
              {{ current }} / {{ goalText }} руб
            </div>
          </div>

          <button class="donate-button" @click="handleDonate">
            Поддержать
          </button>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
import {computed, ref} from 'vue'
import BirdMafiaIcon from "@/assets/bird-mafia.png";

const current = ref(30)
const goal = 1000
const goalText = "10 000"

const progressPercent = computed(() => {
  return Math.min((current.value / goal) * 100, 100)
})

function handleDonate() {
  alert('Спасибо за поддержку Птичьей мафии!')
}
</script>

<style scoped>
.donation-bar {
  display: flex;
  gap: 16px;
  width: 400px;
  background: linear-gradient(180deg, #3a3a3a 0%, #2f2f2f 50%, #252525 100%);
  border: 2px solid rgba(24, 24, 24);
  border-radius: 16px;
  padding: 10px 16px;
  color: #bdbdbd;
  align-items: flex-start;
}

.bird-icon {
  width: 56px;
  margin: auto;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid rgba(24, 24, 24);
}


.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}

.title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #c0c0c0;
  text-align: center;
  text-shadow: 1px 1px 3px #000000;
  letter-spacing: 0.05em;
}

.title .bold {
  font-weight: 800;
}

.bottom-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress {
  flex: 1;
  height: 22px;
  background: #555;
  border-radius: 30px;
  position: relative;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #de6822, #c97f30);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #1f1f1f;
  pointer-events: none;
}

.donate-button {
  background: #de6822;
  color: #1f1f1f;
  border: none;
  padding: 4px 10px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s ease;
  white-space: nowrap;
}
.donation-bar:hover .donate-button {
  background: #ffa726;
}
</style>