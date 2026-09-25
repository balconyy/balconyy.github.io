<script setup lang="ts">
import FeatureTab from './Tab.vue'
import type {Tab, TabId} from '@/models/tabs'

defineProps<{
  tabs: Tab[]
  activeTabId: TabId
}>()

defineEmits<{
  (e: 'clickTab', id: TabId): void
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