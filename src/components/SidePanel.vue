<script setup>

import DailyJoke from "@/features/joke/components/DailyJoke.vue";
import {useDailyWindow} from "@/features/joke/composables/useDailyWindow.ts";
import {onMounted, ref} from "vue";
import {useUserAuth} from "@/features/auth/composables/useUserAuth.ts";
import AuthWindow from "@/features/auth/components/AuthWindow.vue";
import ChatWindow from "@/features/chat/components/ChatWindow.vue";
import {useWindows} from "@/composables/useWindows.ts";

const {
  dailyJokeUrl,
  minHeight,
  currentHeight,
  isOpen,
  initDailyScreen,
  toggleWindowState,
  setWindowHeight
} = useDailyWindow()

const {
  isAuthOpen,
  isChatOpen,
  initWindows,
  toggleAuthWindow,
  toggleChatWindow
} = useWindows()


onMounted(() => {
  initDailyScreen()
  initWindows()
})


function toggleAuth() {
  toggleAuthWindow()
}

function toggleChat() {
  toggleChatWindow()
}
</script>

<template>
  <div class="side-panel">
    <AuthWindow class="auth" :isOpen="isAuthOpen"
                @toggleWindow="toggleAuth"
    />

    <DailyJoke class="daily-joke"
               v-if="dailyJokeUrl"
               :isOpen="isOpen"
               :minHeight="minHeight"
               :currentHeight="currentHeight"
               :url="dailyJokeUrl"
               @toggleWindow="toggleWindowState"
               @stopResizing="setWindowHeight"
    />
    <ChatWindow
        :isOpen="isChatOpen"
        @toggleWindow="toggleChat"/>

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

  padding-top: 16px;
  padding-right: 8px;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  max-height: 100%;

  gap: 12px;
}

.side-panel > * {
  position: relative;
  pointer-events: auto;
}

.auth {
  z-index: 11;
}
</style>