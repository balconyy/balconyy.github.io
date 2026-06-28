<script setup lang="ts">
import {ReviewResponse} from "@/data/dto/movieAddonDTO";
import ReviewCard from "@/features/player/components/info/review/ReviewCard.vue";
import Letterboxd from '@/assets/icons/letterboxd-logo.svg'
import {SquareArrowOutUpRight} from '@lucide/vue';

const {reviewsResponse} = defineProps<{
  reviewsResponse: ReviewResponse[];
}>();

function openReview() {
  window.location.assign(`https://letterboxd.com/film/${reviewsResponse[0].review.movieSlug}/review/`);
}

</script>

<template>
  <h2 class="reviews-title">Отзывы</h2>
  <button class="review-button" @click="openReview">
    <Letterboxd class="button-icon"/>
    Написать свой
    <SquareArrowOutUpRight class="button-icon"/>
  </button>
  <ul class="reviews-list">
    <ReviewCard
        v-for="review in reviewsResponse"
        :reviewData="review"
    />
  </ul>
</template>

<style scoped>

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  padding: 4px 16px;
  align-items: center;
}

.reviews-list > * {
  width: 80%;
}

.review-button {
  background: #009D1A;
  color: white;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  padding: 12px 20px;
  margin: 12px auto 10px auto;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}


.review-button:hover {
  background-color: #00B01D;
}

.review-button:active {
  background-color: #007A14;
  transform: scale(0.98);
}

.button-icon {
  width: 18px;
  height: 18px;
}

.reviews-title {
  position: relative;
  font-size: clamp(16px, 2vw, 28px);
  color: var(--white);
  z-index: 2;
  margin: 0;
  padding: 10px 0 6px 0;
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