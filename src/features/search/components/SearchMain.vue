<script setup lang="ts">
import MovieSearch from "./response/MovieSearch.vue";
import SearchList from "./response/SearchList.vue";
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
} = useSearch();


</script>

<template>
  <div class="search-main">
    <MovieSearch @search="searchMovie"/>

    <LoadingScreen v-if="isLoading"
                   message="Поиск фильмов..."
    />
    <ErrorScreen v-else-if="error"
                 :message="error.message"
    />
    <SearchList v-else-if="isSuccess"
                :movies="movieList"
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