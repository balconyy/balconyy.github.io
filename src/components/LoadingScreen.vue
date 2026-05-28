<script setup>
import Waiter from '@/assets/waiter.svg'

const {message} = defineProps({
  message: {
    type: String,
    default: 'Загрузка...'
  }
})
</script>

<template>
  <div class="loading-screen">
    <img class="loading-icon" :src="Waiter" alt="logo"/>
    <p class="loading-message">{{ message }}</p>
  </div>
</template>

<style scoped>

.loading-screen {
  text-align: center;
  padding: 20px;
  border: 1px solid var(--accent-color);
  border-radius: 5px;
  margin: 20px auto;
  max-width: 500px;
  background: var(--accent-transparent);
}

.loading-icon {
  padding: 10px;
  width: 90px;
  animation: spin 10s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-message {
  color: var(--white);
  font-size: 1.5rem;
  font-weight: 500;
}

</style>
