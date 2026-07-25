<script setup lang="ts">
defineProps<{
  isLoading: boolean,
  isNotAuth: boolean,
}>()

</script>
<template>
  <div class="chat-attention">
    <span v-if="isLoading" class="disabled-text">Загрузка...</span>
    <span v-else-if="isNotAuth" class="disabled-text">Авторизуйтесь, чтобы писать в чат</span>
  </div>
</template>

<style scoped>
.chat-attention {
  display: flex;
  gap: 8px;
  background: #3a3a3a;
  align-items: center;
  justify-content: center;
}

.disabled-text {
  background: #3a3a3a;
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  color: #808080;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  text-align: center;
  user-select: none;
}
</style>