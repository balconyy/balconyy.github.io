<script setup lang="ts">

</script>
<template>
  <div class="customization-attention">
    <span class="disabled-text">Авторизуйтесь, для кастомизации</span>
  </div>
</template>

<style scoped>
.customization-attention {
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