<script setup lang="ts">

import {ReviewResponse} from "@/data/dto/movieAddonDTO";
import {computed} from 'vue'

const props = defineProps<{
  reviewData: ReviewResponse;
}>();

const starsRating = computed(() => {
  const rating = props.reviewData.review.rating
  if (!rating) {
    return ''
  }
  return formatStars(rating)
})


const formattedDate = computed(() => {
  const date = new Date(props.reviewData.review.date)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const linkToProfile = computed(() => {
  const name = props.reviewData?.letterboxdAccount?.name
  return name
      ? `https://letterboxd.com/${name}/`
      : ''
})

function formatStars(rating: number) {
  let result = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      result += '★';
    } else if (rating >= i - 0.5) {
      result += '½';
    }
  }
  return result;
}

</script>

<template>
  <div class="review-card">
    <a :href="linkToProfile">
      <div class="avatar-container">
        <img
            class="avatar"
            :src="reviewData.letterboxdAccount.avatar"
            :alt="reviewData.letterboxdAccount.displayName"
        />

      </div>
    </a>
    <div class="card-content">

      <div class="top-line">
        <a :href="linkToProfile">
          <span class="display-name">{{ reviewData.letterboxdAccount.displayName }}</span>
        </a>
        <span class="date">{{ formattedDate }}</span>
        <span class="stars" v-if="reviewData.review.rating">{{ starsRating }}</span>
      </div>

      <div class="review-text">
        <p>{{ reviewData.review.text }}</p>
      </div>
    </div>
  </div>
</template>


<style scoped>
.review-card {
  position: relative;
  background: radial-gradient(rgba(var(--white-rgb)/0.05) 20%, rgba(var(--accent-black-rgb)/0.8) 100%);
  border: 2px solid var(--accent-black);
  padding: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}


.card-content {
  position: relative;
  flex: 1;
  z-index: 1;
}

.avatar-container {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid var(--accent-black);
}

.top-line {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--accent-dark);
}

.display-name {
  color: var(--accent-light);
  font-size: 15px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.date {
  font-size: 11px;
  color: var(--accent-light);
}

.stars {
  font-size: 22px;
  color: var(--accent-light);
}

.review-text {
  color: var(--accent-light);
  font-size: clamp(12px, 1vw, 16px);
  line-height: 1.8;
  padding: 0.5rem 0;
  text-shadow: 0 0 2px rgba(154, 106, 154, 0.3);
}

.review-text p {
  margin: 0;
  word-break: break-word;
}


.date {
  justify-content: space-between;
  padding-top: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: #8a6a8a;
}


</style>