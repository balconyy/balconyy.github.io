<script setup>
import PlayerComponent from "@/features/player/components/PlayerComponent.vue";

defineProps({
  kp_id: {
    type: String,
    required: true
  }
})
</script>

<template>
  <h1 class="content-title">
  </h1>
  <PlayerComponent class="player-component"/>
</template>

<style scoped>

.content-title {
  position: relative;
  color: white;
  z-index: 2;
  font-size: clamp(38px, 4.2vw, 58px);
  margin: 0;
  line-height: 1.05;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  transition: all 0.3s ease;
}

</style>