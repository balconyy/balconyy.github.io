<script setup lang="ts">
import ResizableContainer from '@/components/window/ResizableContainer.vue'
import BaseWindow from "@/components/window/BaseWindow.vue"
import grinIcon from '@/assets/media/ebalo.png'

defineProps<{
  url: string,
  currentHeight: number,
  currentWidth: number,
  isOpen: boolean
}>()
const emit = defineEmits(['resize', 'toggleWindow'])
</script>

<template>
  <BaseWindow
      title="Прикол дня"
      headerColorHex="#311f17"
      :headerIcon="grinIcon"
      :isOpen="isOpen"
      :currentHeight="currentHeight"
      :currentWidth="currentWidth"
      @toggleWindow="emit('toggleWindow')"
  >
    <ResizableContainer
        :currentWidth="currentWidth"
        @resize="emit('resize', $event)"
    >
      <img class="joke-container" :src="url" alt="Прикол дня"/>
    </ResizableContainer>
  </BaseWindow>
</template>

<style scoped>
.joke-container {
  width: 100%;
  height: 100%;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: contain;
}
</style>