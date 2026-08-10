<script setup lang="ts">

import {useStreamerInfo} from "@/features/streamer/composables/useStreamerInfo";
import StreamerRating from "@/features/streamer/components/StreamerRating.vue";
import {onMounted} from "vue";

const {
  ratings,
  getStreamersRating,
} = useStreamerInfo()

const props = defineProps<{
  kpId: number;
}>()

onMounted(() => {
  getStreamersRating(props.kpId)
})
</script>

<template>
  <div v-if="ratings && ratings.length">
    <h2 class="rating-title">Оценки стримеров</h2>
    <div class="rating-list__content">
      <ul class="rating-list" ref="grid">
        <StreamerRating
            v-for="rating in ratings"
            :streamer="rating"
        />
      </ul>
    </div>
  </div>
</template>

<style scoped>
.rating-list {
  display: flex;
  gap: 16px;

  overflow-x: auto;
  overflow-y: hidden;

  padding: 8px 16px;
  margin-bottom: 24px;

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

.rating-list__content {
  display: flex;
  justify-content: center;

  width: max-content;
  min-width: 100%;
}
</style>