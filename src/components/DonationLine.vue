<script setup>
import {computed} from 'vue'
import {useAnalytics} from "@/composables/useAnalytics.ts";

const {donationText, currentValue, goalValue} = defineProps({
  donationText: {
    type: String,
  },

  currentValue: {
    type: Number,
  },

  goalValue: {
    type: Number,
  }
})

const progressPercent = computed(() => {
  return Math.min((currentValue / goalValue) * 100, 100)
})

const analytics = useAnalytics()

function onDonationClicked() {
  analytics.track('donation_clicked');
}
</script>

<template>
  <a href="https://www.donationalerts.com/r/birdy_mafia"
     @click="onDonationClicked"
     referrerpolicy="no-referrer">
    <div class="donation-bar">

      <div class="content">
        <h3 class="title">{{ donationText }}</h3>

        <div class="bottom-row">
          <div class="progress">
            <div class="fill" :style="{ width: progressPercent + '%' }"></div>
            <div class="progress-text">
              {{ currentValue }} / {{ goalValue }} руб
            </div>
          </div>

          <button class="donate-button">
            Поддержать
          </button>
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped>
.donation-bar {
  display: flex;
  gap: 16px;
  background: linear-gradient(180deg, #3a3a3a 0%, #2f2f2f 50%, #252525 100%);
  border: 2px solid rgba(24, 24, 24);
  border-radius: 16px;
  padding: 14px 26px;
  color: #bdbdbd;
  align-items: flex-start;
}


.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
}

.title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #c0c0c0;
  text-align: center;
  text-shadow: 1px 1px 3px #000000;
  letter-spacing: 0.10em;
}

.bottom-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress {
  flex: 1;
  height: 22px;
  min-width: 120px;
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