<script setup lang="ts">
import BaseWindow from "@/components/window/BaseWindow.vue";
import chatIcon from "@/assets/icons/chat-icon.png";
import ChatList from "@/features/chat/components/ChatList.vue";
import ChatInput from "@/features/chat/components/ChatInput.vue";
import {storeToRefs} from "pinia";
import {computed, onMounted} from "vue";
import WindowLoading from "@/components/window/WindowLoading.vue";
import ChatAttention from "@/features/chat/components/ChatAttention.vue";
import {useUserAuth} from "@/features/auth/composables/useUserAuth";
import {connectChatSocket} from "@/services/chatSocket";
import {useChatStore} from "@/store/chat";
import ResizableContainer from "@/components/window/ResizableContainer.vue";

defineProps<{
  currentHeight: number,
  currentWidth: number,
  isOpen: boolean
}>()

const emit = defineEmits(['resize', 'toggleWindow'])

const chatStore = useChatStore();

const {chat, online, isLoading} = storeToRefs(chatStore);
const {getChatLogs, sendMessage} = chatStore;

const userAuth = useUserAuth();
const isAuth = computed(() => userAuth.user.value != null);

onMounted(() => {
  getChatLogs();
  connectChatSocket();
})
</script>

<template>
  <BaseWindow
      title="Чач"
      headerColorHex="#211731"
      :headerIcon="chatIcon"
      :isOpen="isOpen"
      :currentHeight="currentHeight"
      :currentWidth="currentWidth"
      @toggleWindow="$emit('toggleWindow')">
    <ResizableContainer
        class="chat-container"
        :currentWidth="currentWidth"
        @resize="emit('resize', $event)"
    >
      <WindowLoading v-if="isLoading"/>
      <ChatList v-else :messages="chat" :isOpen="isOpen"/>
      <ChatAttention v-if="isLoading || !isAuth" :isLoading="isLoading" :isNotAuth="!isAuth"/>
      <ChatInput v-else @sendMessage="sendMessage" :online="online"/>
    </ResizableContainer>
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