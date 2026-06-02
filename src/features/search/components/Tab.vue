<!-- FeatureTab.vue -->
<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
}>()

defineEmits<{
  (e: 'clickTab'): void
}>()
</script>

<template>
  <button
      class="feature-tab"
      :class="{ active }"
      @click="$emit('clickTab')"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.feature-tab {
  position: relative;
  padding: 8px 12px;
  border: none;
  border-radius: 1px;
  background: transparent;

  color: #8b8b8b;
  font-size: 16px;
  font-weight: 600;
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
  border-bottom: 3px solid #8b5cf6;
}

</style>