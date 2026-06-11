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
// const configStore = useRemoteConfigStore();
// const dailyJoke = computed(() => configStore.remoteConfig?.dailyJoke);
// const isConfigLoaded = computed(() => configStore.loaded);
</script>

<template>
  <Background/>
<!--  <DailyJoke v-if="isConfigLoaded && dailyJoke.url"-->
<!--             :url="dailyJoke.url"-->
<!--             :defaultHeight="dailyJoke.height"-->
<!--  />-->
  <MovieInfo :kpId="kpId"/>
  <PlayerComponent/>

</template>

