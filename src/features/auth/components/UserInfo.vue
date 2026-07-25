<script setup lang="ts">
import {User} from "@/models/user";
import ExitIcon from '@/assets/icons/exit-icon.png'

defineProps<{
  user: User
}>()

defineEmits(['logout']);
</script>

<template>
  <div class="user-content">
    <div class="user-info">
      <img
          class="avatar"
          :src="user.profileImageUrl"
          :alt="user.displayName"/>

      <span class="name" :style="{ color: user.nameColor }">
        {{ user.displayName }}
      </span>
    </div>

    <div class="menu-wrapper">
      <div class="arrow-container">
        <span class="arrow-icon"></span>
      </div>

      <div class="popup-menu">
        <button class="menu-item" @click="$emit('logout')">
          <img
              class="menu-icon"
              :src="ExitIcon"
              alt="выход"/>
          <span class="menu-text">Выйти</span>
        </button>
      </div>
    </div>
  </div>

</template>

<style scoped>

.user-content {
  display: flex;
  align-items: stretch;
  justify-content: center;
}


.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  padding: 8px 12px 8px 12px;
}


.avatar {
  width: 36px;
  height: 36px;
  border-radius: 2px;
  object-fit: cover;
  border: 2px solid;
  border-color: #7a7a7a #3a3a3a #3a3a3a #7a7a7a;
  background: #1a1a1a;
}

.name {
  font-size: 14px;
  font-weight: 600;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.menu-wrapper {
  position: relative;
  display: inline-flex;
}

.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 9px;
  cursor: pointer;
  border-left: 2px dashed #5a5a5a;
  transition: background 0.2s ease;
}


.arrow-icon {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #fff;
}

.popup-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-right: -3px;

  background: #111;

  box-sizing: border-box;
  border: 2px solid #4b4b4b;

  visibility: hidden;
}

.menu-wrapper:hover .popup-menu {
  visibility: visible;
}

.menu-wrapper:hover .arrow-container {
  background: rgba(255, 255, 255, .1);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;

  border: none;
  background: transparent;

  color: #ddd;

  padding: 10px 8px;
  cursor: pointer;
}

.menu-item:hover {
  background: #292929;
}

.menu-text{
  font-size: 15px;
  font-family: Tahoma, "MS Sans Serif", sans-serif;
}

.menu-icon {
  width: 12px;
  height: 12px;
}

</style>