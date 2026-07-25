<script setup lang="ts">
import BaseWindow from "@/components/window/BaseWindow.vue";
import chatIcon from "@/assets/icons/chat-icon.png";
import ChatList from "@/features/chat/components/ChatList.vue";
import ChatInput from "@/features/chat/components/ChatInput.vue";
import {useChat} from "@/features/chat/composables/useChat";
import {computed, onMounted} from "vue";
import WindowLoading from "@/components/window/WindowLoading.vue";
import ChatAttention from "@/features/chat/components/ChatAttention.vue";
import {useUserAuth} from "@/features/auth/composables/useUserAuth";

defineProps<{
  isOpen: boolean,
}>()

const emit = defineEmits(['toggleWindow']);

const {
  chat,
  isLoading,
  getChatLogs,
  sendMessage,
  connectToChat
} = useChat();

const userAuth = useUserAuth();

const isNotAuth = computed(() => userAuth.user.value == null);

onMounted(() => {
  getChatLogs()
  connectToChat()
})


</script>

<template>
  <BaseWindow
      title="Чат"
      headerColorHex="#211731"
      :headerIcon="chatIcon"
      :isOpen="isOpen"
      @toggleWindow="$emit('toggleWindow')">
    <div class="chat-container">
      <WindowLoading v-if="isLoading"/>
      <ChatList v-else :messages="chat" :isOpen="isOpen"/>
      <ChatAttention v-if="isLoading || isNotAuth" :isLoading="isLoading" :isNotAuth="isNotAuth"/>
      <ChatInput v-else @sendMessage="sendMessage"/>
    </div>

  </BaseWindow>


</template>

<style scoped>

.chat-container {
  display: flex;
  flex-direction: column;
  padding: 8px;
  background: #3a3a3a;
}


</style>