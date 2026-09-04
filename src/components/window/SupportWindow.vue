<script setup lang="ts">
import heartIcon from "@/assets/icons/heart-icon.png";
import BaseWindow from "@/components/window/BaseWindow.vue";
import SupportButton from "@/components/window/SupportButton.vue";
</script>
<template>
  <BaseWindow
      title="Помощь проекту"
      headerColorHex="#ad4202"
      :headerIcon="heartIcon"
      :isOpen="true"
      :buttonEnabled="false">
    <div class="content-wrapper">
      <SupportButton/>
    </div>
  </BaseWindow>
</template>
<style scoped>
.content-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 8px 32px;
}

.info-text {
  flex: 1;
  color: #ffffff;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  text-align: center;
  user-select: none;
}
</style>