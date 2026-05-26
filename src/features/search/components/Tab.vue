<!-- FeatureTab.vue -->
<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
      class="feature-tab"
      :class="{ active }"
      @click="$emit('click')"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.feature-tab {
  position: relative;
  padding: 10px 0;
  border: none;
  background: transparent;

  color: #8b8b8b;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;

  transition:
      color 0.2s ease,
      opacity 0.2s ease;
}

.feature-tab:hover {
  opacity: 0.8;
}

.feature-tab.active {
  color: #ffffff;
}

.feature-tab.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;

  width: 100%;
  height: 2px;

  background: #8b5cf6;
  border-radius: 999px;
}
</style>