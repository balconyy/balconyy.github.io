<script setup lang="ts">
import MovieSearch from "./response/MovieSearch.vue";
import SearchList from "./SearchList.vue";
import FeatureTabs from "@/features/search/components/FeatureTabs.vue";
import {useSearch} from "@/features/search/composables/useSearch";
import {HISTORY_TAB_ID, SEARCH_TAB_ID, useTabs} from "@/features/search/composables/useTabs";
import HistoryList from "@/features/search/components/HistoryList.vue";
import {useRouter} from "vue-router";
import {Movie} from "@/models/movie";

const router = useRouter()
const onMovieClick = (movie: Movie) => {
  router.push({
    name: 'movie',
    params: {kpId: movie.kpId},
  })
}

const {
  movieList,
  error,
  isLoading,
  searchMovies,
} = useSearch();

const {
  tabs,
  activeTabId,
  openSearchTab
} = useTabs()

function search(query: string) {
  searchMovies(query)
  openSearchTab(query)
}


</script>

<template>
  <div class="search-main">
    <MovieSearch @search="search"/>

    <FeatureTabs v-model="activeTabId" :tabs="tabs"/>

    <SearchList v-if="activeTabId === SEARCH_TAB_ID"
                :movies="movieList"
                :loading="isLoading"
                :error-message="error?.message"
                @selectMovie="onMovieClick"
    />

    <HistoryList v-else-if="activeTabId === HISTORY_TAB_ID"
                 @selectMovie="onMovieClick"
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