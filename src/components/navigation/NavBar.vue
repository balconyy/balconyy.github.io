<script setup lang="ts">
import NavIcon from './NavIcon.vue'
import homeIcon from "@/assets/icons/home-icon.png";
import cinemaIcon from "@/assets/icons/cinema-icon.png";
import {useRouter} from "vue-router";

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

const router = useRouter()

function clickHome() {
  router.push({
    name: 'home',
  })
}

function clickCinema() {
  router.push({
    name: 'cinema',
  })
}


</script>

<template>
  <div class="nav-bar">
    <NavIcon
        v-if="showHome"
        label="Главная"
        :icon="homeIcon"
        @open="clickHome"
    />
    <NavIcon
        v-if="showCinema"
        label="Кинозал"
        :icon="cinemaIcon"
        @open="clickCinema"
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