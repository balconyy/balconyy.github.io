<script setup>

import ErrorScreen from "@/components/ErrorScreen.vue";
import MovieCard from "@/components/MovieCard.vue";
import {useHistory} from "@/features/search/composables/useHistory.ts";
import {onMounted} from "vue";

const {
  history,
  errorMessage,
  getLocalHistory,
  removeMovieFromHistory,
} = useHistory()


onMounted(() => {
  getLocalHistory();
});
</script>

<template>
  <ErrorScreen v-if="errorMessage"
               :message="errorMessage"
  />

  <ul v-else-if="history" class="movie-list">
    <MovieCard
        v-for="movie in history"
        :movie="movie"
        :showDeleteButton="true"
        @selectMovie="$emit('selectMovie', $event)"
        @deleteMovie="removeMovieFromHistory"
    />
  </ul>
</template>

<style scoped>

</style>