<script setup lang="ts">
import MovieSearch from "./MovieSearch.vue";
import SearchList from "./SearchList.vue";
import MovieLoading from "./MovieLoading.vue";
import {useSearchStore} from "@/store/searchStore";

const store = useSearchStore()

const onSearch = (query: string) => {
  store.searchMovies(query);
};

</script>

<template>
  <div class="search-main">
    <MovieSearch @search="onSearch"/>

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