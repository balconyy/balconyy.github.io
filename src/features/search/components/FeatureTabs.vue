<script setup lang="ts">
import FeatureTab from './Tab.vue'

defineProps<{
  tabs: { id: number; label: string }[]
  activeTabId: number
}>()

defineEmits<{
  (e: 'clickTab', id: number): void
}>()

</script>

<template>
  <div class="tabs">
    <FeatureTab
        v-for="tab in tabs"
        :key="tab.id"
        :label="tab.label"
        :active="activeTabId === tab.id"
        @clickTab="$emit('clickTab', tab.id)"
    />
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 0 0 16px 0;
}
</style>