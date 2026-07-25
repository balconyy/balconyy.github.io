<script setup lang="ts">
import loadingIcon from '@/assets/icons/loading-icon.png'
</script>

<template>
  <div class="loading-content">
    <img
        class="loading-image"
        :src="loadingIcon"
        alt="Прикол дня"
    />
  </div>
</template>

<style scoped>
.loading-content {
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-image {
  width: 16px;
  animation: hourglass-spin 2.5s infinite;
  transform-origin: center;
}

@keyframes hourglass-spin {
  0% {
    transform: rotate(0deg);
  }

  20% {
    transform: rotate(180deg);
  }

  50% {
    transform: rotate(180deg);
  }

  70% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>