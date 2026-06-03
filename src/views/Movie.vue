<script setup>
import PlayerComponent from "@/features/player/components/PlayerComponent.vue";
import MovieInfo from "@/features/player/components/info/MovieInfo.vue";

defineProps({
  kpId: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <MovieInfo :kpId="kpId"/>
  <PlayerComponent/>

</template>

