<script setup lang="ts">

import {onMounted} from "vue";
import ErrorScreen from "@/components/ErrorScreen.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import {useStreamerVodsList} from "@/features/streamer/composables/useStreamerVodsList";
import VodStreamerItem from "@/features/streamer/components/vods/VodStreamerItem.vue";


const {streamers, isLoading, error, getVodStreamers} = useStreamerVodsList()

onMounted(() => {
  getVodStreamers()
})
</script>

<template>
  <LoadingScreen v-if="isLoading"
                 message="Загрузка стримеров..."
  />
  <ErrorScreen v-else-if="error"
               :message="error.message"
  />

  <ul v-else-if="streamers.length" class="vod-streamers-list">
    <VodStreamerItem
        v-for="streamer in streamers"
        :key="streamer.streamerId"
        :streamer="streamer"
    />
  </ul>
</template>

<style scoped>
.vod-streamers-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>