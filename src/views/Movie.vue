<script setup>
import PlayerComponent from "@/features/player/components/PlayerComponent.vue";
import MovieInfo from "@/features/player/components/info/MovieInfo.vue";
import Background from "@/components/Background.vue";
import {useDailyWindow} from "@/features/admin/composables/config/useDailyWindow.ts";
import {onMounted} from "vue";
import DailyJoke from "@/components/DailyJoke.vue";

defineProps({
  kpId: {
    type: Number,
    required: true
  }
})
const {
  dailyJokeUrl,
  minHeight,
  currentHeight,
  isOpen,
  initDailyScreen,
  changeWindowState,
  setWindowHeight
} = useDailyWindow()


onMounted(() => {
  initDailyScreen()
})
</script>

<template>
  <Background/>
  <DailyJoke v-if="dailyJokeUrl"
             :url="dailyJokeUrl"
             :currentHeight="currentHeight"
             :minHeight="minHeight"
             :isOpen="isOpen"
             @stopResizing="setWindowHeight"
             @buttonClicked="changeWindowState"
  />
  <MovieInfo :kpId="kpId"/>
  <PlayerComponent/>

</template>

