<script setup lang="ts">

import {nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, watch} from "vue";
import {Message} from "@/models/message";
import {MessagePart, parseMessageParts} from "@/utils/message";
import LazyChatImage from "@/features/chat/components/LazyChatImage.vue";

const props = defineProps<{
  messages: Message[],
  isOpen: boolean,
}>()


const chatLog = ref<HTMLElement | null>(null);
const chatLogInner = ref<HTMLElement | null>(null);

provide('chatScrollRoot', chatLog);
const BOTTOM_THRESHOLD_PX = 48;

const isPinnedToBottom = ref(true);

function scrollToBottom() {
  if (chatLog.value) {
    chatLog.value.scrollTop = chatLog.value.scrollHeight;
  }
}

function scrollToBottomIfPinned() {
  if (isPinnedToBottom.value) {
    scrollToBottom();
  }
}

function onScroll() {
  if (!chatLog.value) return;
  const {scrollTop, scrollHeight, clientHeight} = chatLog.value;
  isPinnedToBottom.value = scrollHeight - scrollTop - clientHeight <= BOTTOM_THRESHOLD_PX;
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  scrollToBottom();
  isPinnedToBottom.value = true;

  if (chatLogInner.value) {
    resizeObserver = new ResizeObserver(() => {
      scrollToBottomIfPinned();
    });
    resizeObserver.observe(chatLogInner.value);
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

watch(() => props.isOpen, async (isOpen) => {
  if (!isOpen) return;
  await nextTick();

  isPinnedToBottom.value = true;
  scrollToBottom();
});

watch(() => props.messages, async (newMessages) => {
  if (!newMessages) return;
  await nextTick();

  isPinnedToBottom.value = true;
  scrollToBottom();
}, {deep: true});


onUpdated(() => {
      requestAnimationFrame(() => {
        scrollToBottomIfPinned();
      });
    }
)

const partsCache = new WeakMap<Message, MessagePart[]>();

function getMessageParts(message: Message): MessagePart[] {
  let parts = partsCache.get(message);
  if (!parts) {
    parts = parseMessageParts(message.text);
    partsCache.set(message, parts);
  }
  return parts;
}

function getMessageText(message: Message): string {
  return getMessageParts(message)
      .filter((part): part is Extract<MessagePart, { type: 'text' }> => part.type === 'text')
      .map(part => part.value)
      .join('');
}


function getMessageImages(message: Message): string[] {
  return getMessageParts(message)
      .filter((part): part is Extract<MessagePart, { type: 'image' }> => part.type === 'image')
      .map(part => part.value);
}

function getMessageKey(message: Message, index: number): string | number {
  const withId = message as unknown as { id?: string | number };
  return withId.id ?? `${message.createdAt}-${index}`;
}
</script>

<template>
  <div class="chat-log" ref="chatLog" @scroll="onScroll">
    <div class="chat-log-inner" ref="chatLogInner">
      <div
          v-for="(message, index) in messages"
          :key="getMessageKey(message, index)"
          class="chat-line"
      >
        <span class="timestamp">{{new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          }}</span>{{ ''}}

        <div v-if="message.blobImage" class="message-badge">
          <img :src="message.blobImage" alt=""/>
        </div>

        <span
            class="username"
            :style="{ color: message.nameColor }"
        >{{ message.displayName }}:</span> <span class="text">{{ getMessageText(message) }}</span>

        <div v-if="getMessageImages(message).length" class="chat-line-images">
          <LazyChatImage
              v-for="(url, imageIndex) in getMessageImages(message)"
              :key="imageIndex"
              :src="url"
          />
        </div>
      </div>
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

.message-badge {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  vertical-align: middle;
}

.message-badge img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
}

.chat-line {
  padding: 2px 0;
  line-height: 20px;
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
  margin-left: 5px;
}

.text {
  min-width: 0;
  color: #dcddde;
}

.chat-line-images {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
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