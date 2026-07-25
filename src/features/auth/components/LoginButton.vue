<script setup lang="ts">
import TwitchLogo from "@/assets/icons/twitch-logo.png";

defineEmits(['buttonClicked'])
</script>

<template>
  <div class="login-container">
    <button class="login-button" @click="$emit('buttonClicked')">
      <img class="login-icon"  :src="TwitchLogo" alt="twitch"/>
       <span class="login-text">Войти</span>
    </button>
  </div>
</template>

<style scoped>

.login-container {
  padding: 16px 32px;
}

.login-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 8px 8px;

  background: #3a3a3a;
  color: #f2f2f2;

  font-family: Tahoma, "MS Sans Serif", sans-serif;
  font-size: 15px;
  font-weight: 700;

  border: 2px solid;
  border-color: #707070 #101010 #101010 #707070;
  cursor: pointer;
  user-select: none;

  transition: background .08s;
}

.login-button:hover {
  background: #383838;
}

.login-button:active {
  background: #252525;
  border-color: #101010 #606060 #606060 #101010;
  transform: translate(1px, 1px);
}

.login-text {
  display: flex;
  align-items: center;
  line-height: 22px;
}

.login-icon{
  width: 21px;
  height: 22px;
  flex-shrink: 0;
}

</style>