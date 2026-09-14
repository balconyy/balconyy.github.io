<script setup lang="ts">
import {onMounted} from 'vue'

import type {StreamerVodDto} from '@/data/dto/vod/streamerVodDto'
import {useVodPlayer} from "@/features/player/composables/useVodPlayer";

const props = defineProps<{
  kpId: number
}>()

const {
  vodsList,
  vodQualityList,
  currentVodUrl,
  isListLoading,
  isPlayerLoading,
  getAvailableVods,
  getPlayerLinks
} = useVodPlayer()

onMounted(() => {
  getAvailableVods(props.kpId)
})

function onSelectVod(vod: StreamerVodDto) {
  getPlayerLinks(vod)
}

function onError(e: Event) {
  console.error('video error', e)
}
</script>

<template>
  <div class="vod-player">

    <div class="vod-video">
      <p v-if="isPlayerLoading">Загрузка плеера...</p>
      <video
          v-else-if="currentVodUrl"
          :src="currentVodUrl"
          controls
          playsinline
          referrerpolicy="no-referrer"
          @error="onError"
      />
    </div>
  </div>
</template>

<style scoped>
.vod-player {
  color: white;
  width: 70%;
  margin: 0 auto;
}

.vod-list li {
  cursor: pointer;
  padding: 4px 0;
}

.vod-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 10px;
  background: #050505;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

video {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
}
</style>