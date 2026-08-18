<script setup>

import DailyJoke from "@/features/joke/components/DailyJoke.vue";
import {onMounted} from "vue";
import AuthWindow from "@/features/auth/components/AuthWindow.vue";
import ChatWindow from "@/features/chat/components/ChatWindow.vue";
import {useWindows} from "@/composables/useWindows.ts";
import WindowsColumn from "@/components/window/WindowsColumn.vue";


const {
  isAuthOpen,
  isJokeOpen,
  isChatOpen,
  windowsSetting,
  initWindows,
  toggleAuthWindow,
  toggleJokeWindow,
  toggleChatWindow,
  saveWindowsSetting
} = useWindows()


onMounted(() => {
  initWindows()
})


const jokeUrl = "https://images.thevoicemag.ru/upload/img_cache/e08/e08bc0fdb313f9098b5bfb1e23eabebc_cropped_600x739.jpeg"
</script>

<template>
  <div class="side-panel">
    <AuthWindow class="auth" :isOpen="isAuthOpen"
                @toggleWindow="toggleAuthWindow()"
    />

    <WindowsColumn class="windows-column-wrapper"
                   :isJokeOpen="isJokeOpen"
                   :windowsSetting="windowsSetting"
                   :minHeightTop="150" :minHeightBottom="150"
                   :minWidthTop="250" :minWidthBottom="250"
                   :initialWidthTop="320" :initialWidthBottom="320"
                   @windowChange="saveWindowsSetting"
    >
      <template #top="{ height, width, onResize }">
        <DailyJoke
            :url="jokeUrl"
            :currentHeight="height"
            :currentWidth="width"
            :isOpen="isJokeOpen"
            @resize="onResize"
            @toggleWindow="toggleJokeWindow"
        />
      </template>

      <template #bottom="{ height, width, onResize }">
        <ChatWindow
            :isOpen="isChatOpen"
            :currentHeight="height"
            :currentWidth="width"
            @toggleWindow="toggleChatWindow"
            @resize="onResize"
        />
      </template>
    </WindowsColumn>
  </div>
</template>

<style scoped>

.side-panel {
  position: fixed;
  pointer-events: none;

  z-index: 10;

  top: 0;
  bottom: 0;
  right: 0;

  padding-top: 4px;
  padding-right: 8px;
  gap: 8px;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  max-height: 100%;
}

.side-panel > * {
  position: relative;
}

.windows-column-wrapper {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
}

.auth {
  pointer-events: auto;
  z-index: 11;
}
</style>