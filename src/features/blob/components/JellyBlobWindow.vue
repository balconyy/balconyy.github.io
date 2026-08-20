<script setup lang="ts">
import ResizableContainer from '@/components/window/ResizableContainer.vue'
import BaseWindow from "@/components/window/BaseWindow.vue"
import slimeIcon from '@/assets/media/ditto.png'
import JellyBlob from "@/features/blob/components/JellyBlob.vue";
import {computed, ref} from "vue";
import WindowTabs from "@/components/window/WindowTabs.vue";
import {useUserAuth} from "@/features/auth/composables/useUserAuth";

defineProps<{
  currentHeight: number,
  currentWidth: number,
  isOpen: boolean
}>()
const emit = defineEmits(['resize', 'toggleWindow'])
const currentTab = ref('Главная')

const userAuth = useUserAuth();
const isAuth = computed(() => userAuth.user.value != null);
</script>

<template>
  <BaseWindow
      title="Мялка-Жмялка"
      headerColorHex="#0a2e69"
      :headerIcon="slimeIcon"
      :isOpen="isOpen"
      :currentHeight="currentHeight"
      :currentWidth="currentWidth"
      @toggleWindow="emit('toggleWindow')"
  >
    <ResizableContainer
        class="container"
        :currentWidth="currentWidth"
        @resize="emit('resize', $event)"
    >
      <WindowTabs v-model="currentTab"/>
      <div class="jelly-blob-wrapper">
        <JellyBlob v-if="currentTab == 'Главная'" :areaWidth="currentWidth - 30" :areaHeight="currentHeight - 80" :isAuth="isAuth"/>
      </div>
    </ResizableContainer>
  </BaseWindow>
</template>

<style scoped>
.container {
  background-color: #3a3a3a;
  padding: 0 10px 0 10px;

}

.jelly-blob-wrapper {
  background-color: #1f1f1f;
  border-left: 2px solid #2a2a2a;
  border-right: 2px solid #4a4a4a;
  border-bottom: 2px solid #4a4a4a;
}
</style>