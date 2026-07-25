<script setup lang="ts">
import {User} from "@/models/user";
import authIcon from "@/assets/icons/auth-icon.png";
import BaseWindow from "@/components/window/BaseWindow.vue";
import LoginButton from "@/features/auth/components/LoginButton.vue";
import WindowLoading from "@/components/window/WindowLoading.vue";
import UserInfo from "@/features/auth/components/UserInfo.vue";
import {computed} from "vue";
import {blendColors} from "@/utils/colors";
import {useUserAuth} from "@/features/auth/composables/useUserAuth";

defineProps<{
  isOpen: boolean,
}>()
defineEmits(['toggleWindow']);

const {
  user,
  isLoading,
  login,
  logout
}= useUserAuth()

const dynamicColor = computed(() =>
    user.value?.nameColor
        ? blendColors(user.value.nameColor, '#252525', 0.65)
        : '#111111'
)
</script>
<template>
  <BaseWindow
      title="Аккаунт"
      :headerColorHex="dynamicColor"
      :headerIcon="authIcon"
      :isOpen="isOpen"
      @toggleWindow="$emit('toggleWindow')">
    <WindowLoading v-if="isLoading"/>
    <UserInfo v-else-if="user" :user="user" @logout="logout"/>
    <LoginButton v-else @buttonClicked="login"/>
  </BaseWindow>
</template>

<style scoped>


</style>