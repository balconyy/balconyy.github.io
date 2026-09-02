<script setup lang="ts">

import {nextTick, onMounted, onUpdated, ref, watch} from "vue";

const props = defineProps<{
  messages: Message[],
  isOpen: boolean,
}>()


const chatLog = ref<HTMLElement | null>(null);

function scrollToBottom() {
  if (chatLog.value) {
    chatLog.value.scrollTop = chatLog.value.scrollHeight * 20;
  }
}

onMounted(() => {
  scrollToBottom();
})

watch(() => props.isOpen, async () => {
  await nextTick();
  scrollToBottom();
});


onUpdated(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      });
    }
)

</script>

<template>
  <div class="chat-log" ref="chatLog">
    <div
        v-for="message in messages"
        class="chat-line"
    >
      <span class="timestamp">{{
          new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        }}</span> <span
        class="username"
        :style="{ color: message.nameColor }"
    >{{ message.displayName }}:</span> <span class="text">{{ message.text }} </span>

    </div>
  </div>
</template>

<style scoped>
.chat-log {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  padding: 8px 4px;
  color: #dcddde;
  border: 2px solid;
  border-color: #2a2a2a #4a4a4a #4a4a4a #2a2a2a;
  background: #1f1f1f;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #2b2d31 #1f1f1f;
}

.chat-line {
  padding: 2px 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
  min-width: 0;
}

.timestamp {
  color: #72767d;
}

.username {
  font-weight: bold;
}

.text {
  min-width: 0;
  color: #dcddde;
}


.chat-log::-webkit-scrollbar {
  width: 10px;
}

.chat-log::-webkit-scrollbar-track {
  background: #1f1f1f;
}

.chat-log::-webkit-scrollbar-thumb {
  background-color: #2b2d31;
  border-radius: 8px;
  border: 2px solid #1f1f1f;
}

.chat-log::-webkit-scrollbar-thumb:hover {
  background-color: #35373c;
}

</style>