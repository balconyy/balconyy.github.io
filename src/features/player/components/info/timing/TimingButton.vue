<script setup lang="ts">
import Omega from '@/assets/icons/omega-icon.svg'
import {ref} from "vue";

const emit = defineEmits<{
  toggle: []
}>()

const isClicked = ref(false);

const handleClick = () => {
  isClicked.value = true;
  emit('toggle');
}
</script>


<template>
  <button class="timing-button" :class="{ 'no-animation': isClicked }" @click="handleClick">
    <Omega/>
  </button>
</template>

<style scoped>
.timing-button {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  background: rgba(128, 128, 128, 0.1);
  border: 1px solid #ff3300;
  color: #ff3300;
  font-family: monospace;
  box-shadow: 0 0 10px rgba(255, 51, 0, 0.5);
  animation: attention-pulse 1.5s ease-in-out infinite;
}

.timing-button.no-animation {
  animation: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0;
}

@keyframes attention-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 5px rgba(255, 51, 0, 0.5);
    border-color: #ff3300;
  }
  50% {
    transform: scale(1.04);
    box-shadow: 0 0 25px rgba(255, 51, 0, 0.9);
    border-color: #ff6600;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 5px rgba(255, 51, 0, 0.5);
    border-color: #ff3300;
  }
}
</style>