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
import Customization from "@/features/blob/components/Customization.vue";
import CustomizationAttention from "@/features/blob/components/CustomizationAttention.vue";

defineProps<{
  currentHeight: number,
  currentWidth: number,
  isOpen: boolean
}>()
const emit = defineEmits(['resize', 'toggleWindow'])

const userAuth = useUserAuth();
const isAuth = computed(() => {
  if (userAuth.isLoading.value) return null
  return userAuth.user.value != null
})

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
      <WindowLoading v-if="isSwitching && isAuth === null"/>
      <JellyBlob v-else-if="currentTab === 'Главная'"
                 ref="jellyBlobRef"
                 :areaWidth="currentWidth - 30"
                 :areaHeight="currentHeight - 80"
                 :isAuth="isAuth"
      />
      <Leaderboard v-else-if="currentTab === 'Лидеры'"/>
      <Customization v-else-if="currentTab === 'Кастомизация' && isAuth"/>
      <CustomizationAttention v-else-if="currentTab === 'Кастомизация'"/>
    </ResizableContainer>
  </BaseWindow>
</template>

<style scoped>
.jelly-container {
  background-color: #3a3a3a;
  padding: 0 10px 10px 10px;

}
</style>