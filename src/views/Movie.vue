<script setup>
import PlayerComponent from "@/features/player/components/PlayerComponent.vue";
import MovieInfo from "@/features/player/components/info/MovieInfo.vue";
import Background from "@/components/Background.vue";

defineProps({
  kpId: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <Background/>
  <MovieInfo :kpId="kpId"/>
  <PlayerComponent/>

</template>

