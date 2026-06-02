<template>
  <div>
    <div v-if="message" class="error-message">
      <h2 class="error-title">Кукарака!</h2>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>

const {message} = defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>

.error-message {
  color: var(--white);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  font-size: 1.2rem;
  border: 1px solid var(--accent-color);
  border-radius: 5px;
  margin: 20px auto;
  max-width: 500px;
  background: var(--accent-transparent);
}

</style>
