<script setup lang="ts">

import {Timing} from "@/models/timing";

defineProps<{
  timings: Timing[]
}>()

defineEmits<{
  close: []
}>()


</script>

<template>
  <div class="screen">
    <div class="timing-list">
      <div
          v-for="(timing, index) in timings"
          :key="`${timing.username}-${index}`"
          class="timing-card"
      >
        <div class="nickname">
          {{ timing.username }}
        </div>

        <div class="timing-text">
          {{ timing.timingText }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.screen {
  position: absolute;

  top: 30px;
  left: 42px;

  width: 320px;
  max-height: 350px;

  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.8);

  z-index: 10;
}


.timing-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.timing-list::-webkit-scrollbar {
  width: 8px;
}

.timing-list::-webkit-scrollbar-track {
  background: #111;
}

.timing-list::-webkit-scrollbar-thumb {
  background: var(--accent-dark);
}

.timing-card {
  padding: 8px;
  border: 1px solid rgba(var(--accent-color-rgb)/ 0.15);
  background: rgba(var(--accent-color-rgb)/0.2);
  margin-bottom: 8px;
}

.timing-card:last-child {
  margin-bottom: 0;
}

.nickname {
  margin-bottom: 6px;

  color: var(--accent-color);
  font-weight: bold;
  font-size: 13px;

  text-transform: uppercase;
  letter-spacing: 1px;
}

.timing-text {
  color: #b8b8b8;

  font-size: 12px;
  line-height: 1.45;

  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
}


</style>