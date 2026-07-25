<script setup lang="ts">
import {ref} from 'vue'
import messageIcon from "@/assets/icons/message-icon.png";

const message = ref<string>('');
const emit = defineEmits(['sendMessage'])


function sendMessage() {
  const trimmed = message.value.trim();
  if (!trimmed) return;
  emit('sendMessage', trimmed)

  message.value = ''
}
</script>

<template>
  <div class="chat-input">
    <input
        v-model="message"
        type="text"
        placeholder="Написать сообщение"
        class="input-field"
        @keydown.enter="sendMessage"
    />
    <button class="chat-button" @click="sendMessage">
      <img class="chat-button-icon" :src="messageIcon" alt="message"/>
    </button>
  </div>
</template>

<style scoped>
.chat-input {
  display: flex;
  gap: 8px;
  padding: 6px 0;
  background: #3a3a3a;
  align-items: center;
}

.input-field {
  flex: 1;
  min-width: 0;
  background: #1e1e1e;
  border: 2px solid;
  padding: 8px 10px;
  color: #dcddde;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  outline: none;
  border-color: #2a2a2a #4a4a4a #4a4a4a #2a2a2a;
}

.input-field:focus {
  border-color: var(--accent-light);
}

.input-field::placeholder {
  color: #72767d;
}

.chat-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 4px;

  background: #3a3a3a;
  color: #f2f2f2;

  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 15px;
  font-weight: 700;

  border: 2px solid;
  border-color: #707070 #101010 #101010 #707070;
  cursor: pointer;
  user-select: none;

  transition: background .08s;
}

.chat-button:hover {
  background: #383838;
}

.chat-button:active {
  background: #252525;
  border-color: #101010 #606060 #606060 #101010;
  transform: translate(1px, 1px);
}

.chat-button-icon {
  width: 24px;
  flex-shrink: 0;
}
</style>