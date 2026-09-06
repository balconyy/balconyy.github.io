<script setup lang="ts">
import NavIcon from './NavIcon.vue'
import homeIcon from "@/assets/icons/home-icon.png";
import cinemaIcon from "@/assets/icons/cinema-icon.png";

defineProps({
  showHome: {
    type: Boolean,
    default: true
  },
  showCinema: {
    type: Boolean,
    default: true
  },
})




</script>

<template>
  <div class="nav-bar">
    <NavIcon
        v-if="showHome"
        label="Главная"
        :icon="homeIcon"
        path="/"
    />
    <NavIcon
        v-if="showCinema"
        label="Кинозал"
        :icon="cinemaIcon"
        path="/cinema"
    />
  </div>
</template>

<style scoped>
.nav-bar {
  z-index: 10;
  position: fixed;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>