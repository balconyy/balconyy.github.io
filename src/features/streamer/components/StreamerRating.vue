<script setup lang="ts">
import {computed} from 'vue'
import {StreamerRatingDto} from "@/data/dto/streamerRatingDto";
import KpLogo from "@/assets/icons/kp-logo.svg";
import SiteReferer from "@/features/player/components/info/SiteReferer.vue";
import StreamerLink from "@/features/streamer/components/StreamerLink.vue";


const props = defineProps<{
  streamer: StreamerRatingDto
}>()
const ratingColor = computed(() => {
  const r = props.streamer.rating
  if (r >= 7) return '#3BB33B'
  if (r >= 5) return '#777777'
  return '#FF0000'
})

const KINOPOISK_PROFILE_LINK = "https://www.kinopoisk.ru/user/"

</script>

<template>
  <div class="rating-card">
    <a
        :href="streamer.twitchLink || streamer.otherLink"
        referrerpolicy="no-referrer"
        class="card-link"
    >
      <div class="avatar-wrap">
        <div class="old-school-effect"/>
        <img :src="streamer.avatar" :alt="streamer.nickname" class="avatar"/>
        <div class="rating-badge" :style="{ backgroundColor: ratingColor }">
          {{ streamer.rating }}
        </div>
      </div>
      <div class="nickname">{{ streamer.displayName || streamer.nickname }}</div>
    </a>
    <StreamerLink
        class="site-referer"
        :href="KINOPOISK_PROFILE_LINK + streamer.kpProfile"
        :icon="KpLogo"
        hint="Кинопоиск"
    />
  </div>
</template>

<style scoped>
.rating-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 88px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease, opacity 0.2s ease, filter 0.2s ease;
  animation: card-appear 0.35s ease-out;
}

.rating-card:hover {
  transform: translateY(-2px) scale(1.02);
  filter: brightness(1.05);
}

.card-link {
  display: contents;
  text-decoration: none;
  color: inherit;
}

.avatar-wrap {
  position: relative;
  width: 88px;
  height: 88px;
  flex-shrink: 0;
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
  width: 100%;
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
  border-radius: 12px;
}


.site-referer {
  opacity: 0;
  visibility: hidden;
  margin-top:  6px;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.rating-card:hover .site-referer {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
</style>
