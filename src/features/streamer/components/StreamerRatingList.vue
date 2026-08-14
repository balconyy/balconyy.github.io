<script setup lang="ts">

import StreamerRating from "@/features/streamer/components/StreamerRating.vue";
import {StreamerRatingDto} from "@/data/dto/streamerRatingDto";

const props = defineProps<{
  ratings: StreamerRatingDto[];
}>()

</script>

<template>
  <div v-if="ratings && ratings.length">
    <h2 class="rating-title">Оценки стримеров</h2>
    <ul class="rating-list" ref="grid">
      <StreamerRating
          v-for="rating in ratings"
          :streamer="rating"
      />
    </ul>
  </div>
</template>

<style scoped>
.rating-list {
  display: flex;
  gap: 16px;

  overflow-x: auto;
  overflow-y: hidden;

  padding: 8px 16px 0 16px;
  justify-content: safe center;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--accent-dark-rgb)/0.4) transparent;
}


.rating-title {
  position: relative;
  font-size: clamp(16px, 2vw, 28px);
  color: var(--white);
  z-index: 2;
  margin: 0;
  padding: 4px 0 2px 0;
  line-height: 1.05;
  font-weight: 800;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  transition: all 0.3s ease;
}

</style>