<script setup lang="ts">
withDefaults(defineProps<{
      text?: string,
      disabled?: boolean,
    }>(), {
      disabled: false
    }
)

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
      type="button"
      class="movie-button"
      :disabled="disabled"
      @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<style scoped>
.movie-button {
  background: var(--accent-color);
  color: white;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  padding: 12px 20px;
  margin: 24px auto 10px auto;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(var(--accent-color-rgb) / 0.25);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.movie-button:hover {
  background-color: var(--accent-hover);
  box-shadow: 0 4px 12px rgba(var(--accent-hover-rgb) / 0.3);
}

.movie-button:disabled {
  background: var(--ui-color);
  cursor: not-allowed;
  box-shadow: none;
}


.movie-button:active {
  filter: brightness(0.9);
  transform: scale(0.98);
}
</style>