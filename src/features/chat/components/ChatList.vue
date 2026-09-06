<script setup lang="ts">

import {nextTick, onMounted, onUpdated, provide, ref, watch} from "vue";
import {Message} from "@/models/message";
import {MessagePart, parseMessageParts} from "@/utils/message";
import LazyChatImage from "@/features/chat/components/LazyChatImage.vue";


const props = defineProps<{
  messages: Message[],
  isOpen: boolean,
}>()


const chatLog = ref<HTMLElement | null>(null);

// Отдаём вниз по дереву ссылку на сам скролл-контейнер чата, чтобы
// IntersectionObserver в LazyChatImage считал видимость относительно
// него, а не всей страницы (иначе будут грузиться картинки, скрытые
// под другими окнами/вкладками, если чат не top-level во вьюпорте).
provide('chatScrollRoot', chatLog);

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

// Кэшируем разбор текста на части (текст/картинка) по ссылке на сам
// объект сообщения, чтобы regex не гонялся заново по всем 500 строкам
// при каждом ре-рендере списка (например, когда прилетает новое сообщение).
const partsCache = new WeakMap<Message, MessagePart[]>();

function getMessageParts(message: Message): MessagePart[] {
  let parts = partsCache.get(message);
  if (!parts) {
    parts = parseMessageParts(message.text);
    partsCache.set(message, parts);
  }
  return parts;
}

// Текст без картинок — идёт сразу за ником, на той же строке.
function getMessageText(message: Message): string {
  return getMessageParts(message)
      .filter((part): part is Extract<MessagePart, { type: 'text' }> => part.type === 'text')
      .map(part => part.value)
      .join('');
}

// Картинки из сообщения — рендерятся отдельным блоком под ником,
// а не инлайново среди текста.
function getMessageImages(message: Message): string[] {
  return getMessageParts(message)
      .filter((part): part is Extract<MessagePart, { type: 'image' }> => part.type === 'image')
      .map(part => part.value);
}

// Ключ для v-for. Если в вашей модели Message уже есть стабильный id с
// сервера — замените на него напрямую (:key="message.id"). Без стабильного
// ключа Vue может пересоздавать уже отрисованные строки при обновлении
// списка, и уже загруженные картинки будут лишний раз перезапрашиваться.
function getMessageKey(message: Message, index: number): string | number {
  const withId = message as unknown as { id?: string | number };
  return withId.id ?? `${message.createdAt}-${index}`;
}
</script>

<template>
  <div class="chat-log" ref="chatLog">
    <div
        v-for="(message, index) in messages"
        :key="getMessageKey(message, index)"
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