<script setup>
import PlayerComponent from "@/features/player/components/PlayerComponent.vue";
import MovieInfo from "@/features/player/components/info/MovieInfo.vue";

import {useMovieInfo} from "@/features/player/composables/useMovieInfo.ts";
import {onMounted, ref} from "vue";
const props = defineProps({
  kpId: {
    type: String,
    required: true
  }
})

const movie = ref(null)
onMounted(async () => {
  movie.value = await useMovieInfo().searchMovie(props.kpId)
})
</script>

<template>
  <MovieInfo :movie="movie"/>
  <PlayerComponent/>

</template>

<style scoped>

</style>