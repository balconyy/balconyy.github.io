<script setup lang="ts">
import ResizableContainer from '@/components/window/ResizableContainer.vue'
import BaseWindow from "@/components/window/BaseWindow.vue"
import slimeIcon from '@/assets/media/ditto.png'
import JellyBlob from "@/features/blob/components/JellyBlob.vue";
import {computed, ref} from "vue";
import WindowTabs from "@/components/window/WindowTabs.vue";
import {useUserAuth} from "@/features/auth/composables/useUserAuth";
import Leaderboard from "@/features/blob/components/Leaderboard.vue";
import WindowLoading from "@/components/window/WindowLoading.vue";

defineProps<{
  currentHeight: number,
  currentWidth: number,
  isOpen: boolean
}>()
const emit = defineEmits(['resize', 'toggleWindow'])

const userAuth = useUserAuth();
const isAuth = computed(() => userAuth.user.value != null);

type TabName = 'Главная' | 'Лидеры' | 'Кастомизация'

const currentTab = ref<TabName>('Главная')
const jellyBlobRef = ref<InstanceType<typeof JellyBlob> | null>(null)
const isSwitching = ref(false)

async function handleTabChange(newTab: TabName) {
  if (isSwitching.value) return

  if (currentTab.value === 'Главная' && newTab === 'Лидеры' && jellyBlobRef.value) {
    isSwitching.value = true
    try {
      await jellyBlobRef.value.saveScoreBefore()
    } finally {
      isSwitching.value = false
    }
  }

  currentTab.value = newTab
}

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
        class="jelly-container"
        :currentWidth="currentWidth"
        @resize="emit('resize', $event)"
    >
      <WindowTabs :modelValue="currentTab" @update:modelValue="handleTabChange"/>
      <WindowLoading v-if="isSwitching"/>
      <div class="jelly-blob-wrapper" v-else-if="currentTab === 'Главная'">
        <JellyBlob
            ref="jellyBlobRef"
            :areaWidth="currentWidth - 30"
            :areaHeight="currentHeight - 80"
            :isAuth="isAuth"
        />
      </div>
      <Leaderboard v-else-if="currentTab === 'Лидеры'"/>
    </ResizableContainer>
  </BaseWindow>
</template>

<style scoped>
.jelly-container {
  background-color: #3a3a3a;
  padding: 0 10px 10px 10px;


}

.jelly-blob-wrapper {
  background-color: #1f1f1f;
  padding: 0 2px 2px 2px;
  border-left: 2px solid #2a2a2a;
  border-right: 2px solid #4a4a4a;
  border-bottom: 2px solid #4a4a4a;
}
</style>