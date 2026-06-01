<script setup lang="ts">
import MovieSearch from "./response/MovieSearch.vue";
import MovieList from "./MovieList.vue";
import FeatureTabs from "@/features/search/components/FeatureTabs.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import ErrorScreen from "@/components/ErrorScreen.vue";
import {useSearch} from "@/features/search/useSearch";

const {
  movieList,
  error,
  isSuccess,
  isLoading,
  searchMovie,
  onMovieClick
} = useSearch();


</script>

<template>
  <div class="search-main">
    <MovieSearch @search="searchMovie"/>

    <FeatureTabs/>

    <LoadingScreen v-if="isLoading"
                   message="Поиск фильмов..."
    />
    <ErrorScreen v-else-if="error"
                 :message="error.message"
    />
    <MovieList v-else-if="isSuccess"
               :movies="movieList"
               @select="onMovieClick"
    />

  </div>
</template>

<style scoped>

.search-main {
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}
</style>