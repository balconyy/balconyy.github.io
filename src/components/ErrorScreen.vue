<template>
  <div>
    <div v-if="message" class="error-message">
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
  padding: 20px;
  font-size: 1.2rem;
  border: 1px solid var(--accent-color);
  border-radius: 5px;
  margin: 20px auto;
  max-width: 500px;
  background: var(--accent-transparent);
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 15px;
}
</style>
