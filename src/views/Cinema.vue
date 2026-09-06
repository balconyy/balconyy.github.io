<script setup lang="ts">
import {onMounted, onUnmounted} from "vue";
import {useHead} from "@vueuse/head";
import Background from "@/components/Background.vue";
import CinemaPlayer from "@/features/cinema/components/CinemaPlayer.vue";
import CinemaSidePanel from "@/features/cinema/components/CinemaSidePanel.vue"
import {useCinema} from "@/features/cinema/composables/useCinema";
import {connectChatSocket, disconnectChatSocket} from "@/services/webSocket";
import {useChatStore} from "@/store/chat";

useHead({
  title: 'Кинозал — Balcony',
  meta: [
    {
      name: 'description',
      content: 'Совместный просмотр с обсуждениями.'
    }
  ]
})

const {movie, iframe, currentTimeSec, isLoading, fetchSync, clear} = useCinema()

onMounted(() => {
  connectChatSocket('cinema')
  useChatStore().init()
})

onUnmounted(() => {
  disconnectChatSocket('cinema')
  clear()
})
</script>

<template>
  <Background/>
  <div class="cinema-layout">
    <div class="player-wrapper">
      <CinemaPlayer
          v-if="movie && currentTimeSec !== null"
          :src="iframe"
          :currentTime="currentTimeSec"
          @sync="fetchSync"
      />
      <div v-else class="player-placeholder">
        {{ isLoading ? 'Загрузка…' : 'Сейчас ничего не показывают' }}
      </div>
    </div>

    <CinemaSidePanel/>
  </div>
</template>

<style scoped>
.cinema-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  padding: 8px;
}

.player-wrapper {
  flex: 1;
  min-width: 0;
}

.player-wrapper :deep(> *) {
  width: 100%;
  height: 100%;
}

.player-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #8a8a8a;
}
</style>