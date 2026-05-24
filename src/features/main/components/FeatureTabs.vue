<script setup lang="ts">
import { ref } from 'vue'
import FeatureTab from './Tab.vue'

const tabs = ['Запрос', 'История', 'Популярное']
const activeTab = ref('Запрос')
</script>

<template>
  <div class="tabs">
    <FeatureTab
        v-for="tab in tabs"
        :key="tab"
        :label="tab"
        :active="activeTab === tab"
        @click="activeTab = tab"
    />
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 0 16px 0;
}
</style>