<template>
  <div class="movie-skeleton-wrapper">
    <ContentLoader
        class="movie-skeleton"
        viewBox="0 0 600 100"
        :speed="1.5"
        primaryColor="#222222"
        secondaryColor="#444444"
    >
      <rect
          x="90"
          y="16"
          width="300"
          height="32"
          rx="8"
      />

      <rect
          x="402"
          y="16"
          width="80"
          height="32"
          rx="8"
      />

      <rect
          x="198"
          y="70"
          width="60"
          height="30"
          rx="6"
      />

      <rect
          x="270"
          y="70"
          width="60"
          height="30"
          rx="6"
      />

      <rect
          x="342"
          y="70"
          width="60"
          height="30"
          rx="6"
      />

    </ContentLoader>
  </div>
</template>

<script setup>
import { ContentLoader } from 'vue-content-loader'
</script>

<style scoped>
.movie-skeleton-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.movie-skeleton {
  width: 100%;
  max-width: 600px;
}
</style>