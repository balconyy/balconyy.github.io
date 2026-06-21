<script setup lang="ts">
import MovieSearch from "./MovieSearch.vue";
import SearchList from "./SearchList.vue";
import FeatureTabs from "@/features/search/components/FeatureTabs.vue";
import {useSearch} from "@/features/search/composables/useSearch";
import {HISTORY_TAB_ID, SEARCH_TAB_ID, useTabs} from "@/features/search/composables/useTabs";
import HistoryList from "@/features/search/components/HistoryList.vue";
import {onMounted} from "vue";

const {
  movieList,
  searchText,
  error,
  isSuccess,
  isLoading,
  initSearch,
  searchMovies,
} = useSearch();

const {
  tabs,
  activeTabId,
  createSearchTab,
  activateTabById,
  initTabs
} = useTabs()

function search(query: string) {
  searchMovies(query)
  createSearchTab(query)
  activateTabById(SEARCH_TAB_ID)
}
defineEmits(['selectMovie'])
onMounted(() => {
  initSearch()
  initTabs()
  if (searchText.value.length > 0) {
    createSearchTab(searchText.value)
  }
})

</script>

<template>
  <div class="search-main">
    <MovieSearch @search="search"/>

    <FeatureTabs  :tabs="tabs"
                  :active-tab-id="activeTabId"
                  @clickTab="activateTabById"/>

    <SearchList v-if="activeTabId === SEARCH_TAB_ID"
                :movies="movieList"
                :loading="isLoading"
                :error-message="error?.message"
                @selectMovie="$emit('selectMovie', $event)"
    />

    <HistoryList v-else-if="activeTabId === HISTORY_TAB_ID"
                 @selectMovie="$emit('selectMovie', $event)"
    />


  </div>
</template>

<style scoped>
</style>