<script setup lang="ts">
import MovieSearch from "./response/MovieSearch.vue";
import SearchList from "./response/SearchList.vue";
import MovieLoading from "./MovieLoading.vue";
import {useSearchStore} from "@/store/searchStore";
import FeatureTabs from "@/features/search/components/FeatureTabs.vue";

const store = useSearchStore()

const onSearch = (query: string) => {
  store.searchMovies(query);
};

</script>

<template>
  <div class="search-main">
    <MovieSearch @search="onSearch"/>

    <FeatureTabs/>

    <MovieLoading v-if="store.loading" />

    <SearchList
        v-else
        :movies="store.movies"
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