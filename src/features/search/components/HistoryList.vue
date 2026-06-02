<script setup>

import ErrorScreen from "@/components/ErrorScreen.vue";
import MovieCard from "@/features/search/components/card/MovieCard.vue";
import {useHistory} from "@/features/search/composables/useHistory.ts";
import {onMounted} from "vue";

const {
  history,
  errorMessage,
  getLocalHistory
} = useHistory()


onMounted(() => {
  getLocalHistory();
});
</script>

<template>
  <ErrorScreen v-if="errorMessage"
               :message="errorMessage"
  />

  <div v-else-if="history" class="movie-list">
    <MovieCard
        v-for="movie in history"
        :movie="movie"
        @selectMovie="$emit('selectMovie', $event)"
    />
  </div>
</template>

<style scoped>

</style>