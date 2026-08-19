<script setup lang="ts">
import ResizableContainer from '@/components/window/ResizableContainer.vue'
import BaseWindow from "@/components/window/BaseWindow.vue"
import slimeIcon from '@/assets/media/ditto.png'
import JellyBlob from "@/features/blob/components/JellyBlob.vue";

defineProps<{
  currentHeight: number,
  currentWidth: number,
  isOpen: boolean
}>()
const emit = defineEmits(['resize', 'toggleWindow'])
</script>

<template>
  <BaseWindow
      title="Мялка Жмялка"
      headerColorHex="#0a2e69"
      :headerIcon="slimeIcon"
      :isOpen="isOpen"
      :currentHeight="currentHeight"
      :currentWidth="currentWidth"
      @toggleWindow="emit('toggleWindow')"
  >
    <ResizableContainer
        :currentWidth="currentWidth"
        @resize="emit('resize', $event)"
    >
      <JellyBlob :areaWidth="currentWidth" :areaHeight="currentHeight - 50"/>
    </ResizableContainer>
  </BaseWindow>
</template>

<style scoped>
</style>