<script setup lang="ts">
import ResizableContainer from '@/components/window/ResizableContainer.vue'
import BaseWindow from "@/components/window/BaseWindow.vue";
import grinIcon from '@/assets/media/ebalo.png'


defineProps<{
  url: string,
  currentHeight: number,
  minHeight: number,
  isOpen: boolean
}>()


const emit = defineEmits([
  'stopResizing',
  'toggleWindow'
])


</script>

<template>
  <BaseWindow
      title="Прикол дня"
      headerColorHex="#311f17"
      :headerIcon="grinIcon"
      :isOpen="isOpen"
      @toggleWindow="emit('toggleWindow')"
  >
    <ResizableContainer
        :currentHeight="currentHeight"
        :minHeight="minHeight"
        @stopResizing="emit('stopResizing',$event)"
    >

      <img
          class="joke-container"
          :src="url"
          alt="Прикол дня"
      />

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
  object-fit: cover;
}

</style>