<script setup lang="ts">
import {computed} from 'vue'
import {StreamerRatingDto} from "@/data/dto/streamerRatingDto";


const props = defineProps<{
  streamer: StreamerRatingDto
}>()
const ratingColor = computed(() => {
  const r = props.streamer.rating
  if (r >= 7) return '#3BB33B'
  if (r >= 5) return '#777777'
  return '#FF0000'
})

</script>

<template>
  <div class="rating-card">
    <a :href="`https://www.twitch.tv/${streamer.nickname}`"
       referrerpolicy="no-referrer">
      <div class="avatar-wrap">
        <img :src="streamer.avatar" :alt="streamer.nickname" class="avatar"/>
        <div
            class="rating-badge"
            :style="{ backgroundColor: ratingColor }"
        >
          {{ streamer.rating }}
        </div>
      </div>
      <div class="nickname">{{ streamer.displayName || streamer.nickname }}</div>
    </a>
  </div>
</template>


<style scoped>
.rating-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease;
}

.rating-card:hover {
  transform: translateY(-2px);
}

.avatar-wrap {
  position: relative;
  width: 88px;
  height: 88px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.rating-badge {
  position: absolute;
  right: -4px;
  bottom: -4px;
  min-width: 26px;
  height: 26px;
  padding: 0 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.nickname {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>