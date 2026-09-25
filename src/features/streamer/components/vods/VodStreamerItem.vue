<script setup lang="ts">
import emptyAvatar from '@/assets/media/empty-poster.jpg'
import {RouterLink} from "vue-router";
import {VodsCountDto} from "@/data/dto/vod/vodsCountDto";

const {streamer} = defineProps<{
  streamer: VodsCountDto
}>()

defineEmits(['selectStreamer'])

function onImgError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target.src !== emptyAvatar) {
    target.src = emptyAvatar
  }
}
</script>


<template>
  <div class="vod-streamer-card" @click="$emit('selectStreamer', streamer)" :title="streamer.nickname">
    <RouterLink :to="{ path: `/streamer/${streamer.nickname}` }">
      <div class="avatar-wrap">
        <div class="old-school-effect"/>
        <img
            class="avatar"
            :src="streamer.avatar"
            @error="onImgError"
            :alt="streamer.nickname"
        >
      </div>

      <h3 class="nickname">{{ streamer.nickname }}</h3>
      <p class="vods-count">Записей: {{ streamer.vodsCount }}</p>
    </RouterLink>
  </div>
</template>

<style scoped>
.vod-streamer-card {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  z-index: 2;
  position: relative;
  cursor: pointer;
  transition: 0.2s ease;
  width: 140px;
  border-radius: 12px;
  padding: 16px 16px 28px 16px;
  background: radial-gradient(rgba(var(--white-rgb)/0.1) 40%, rgba(var(--accent-black-rgb)) 100%);
}

.vod-streamer-card:hover {
  transform: scale(1.05);
}

.vod-streamer-card:hover {
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
}

.avatar-wrap {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 0 auto;
  flex-shrink: 0;
}

.avatar {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.nickname {
  font-size: 15px;
  font-weight: 700;
  margin: 12px 0 0 0;
  color: var(--white);
  letter-spacing: -0.5px;
  text-transform: uppercase;
  text-align: center;
  white-space: normal;
  overflow-wrap: normal;
  word-break: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.vods-count {
  margin: 8px 0 0 0;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #999999;
  text-align: center;
}

.old-school-effect {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.1) 0px,
      rgba(0, 0, 0, 0.1) 2px,
      transparent 3px,
      transparent 4px
  );
  pointer-events: none;
  z-index: 4;
  border-radius: 50%;
}
</style>