<script setup lang="ts">
import MovieSearch from "./MovieSearch.vue";
import SearchList from "./SearchList.vue";
import FeatureTabs from "@/features/search/components/FeatureTabs.vue";
import {useSearch} from "@/features/search/composables/useSearch";
import {useTabs} from "@/features/search/composables/useTabs";
import {TabId} from "@/models/tabs";
import HistoryList from "@/features/search/components/HistoryList.vue";
import {onMounted} from "vue";
import PopularList from "@/features/search/components/PopularList.vue";
import VodStreamers from "@/features/streamer/components/vods/VodStreamers.vue";

const {
  movieList,
  error,
  isLoading,
  initSearch,
  searchMovies,
} = useSearch();

const {
  tabs,
  activeTabId,
  setSearchTab,
  clearSearchTab,
  activateTab,
  initTabs
} = useTabs()

function search(query: string) {
  searchMovies(query)
  setSearchTab(query)
  activateTab(TabId.Search)
}

onMounted(() => {
  initSearch()
  initTabs()
})

</script>

<template>
  <div class="search-main">
    <MovieSearch @search="search"/>

    <FeatureTabs :tabs="tabs"
                 :active-tab-id="activeTabId"
                 @clickTab="activateTab"/>

    <SearchList v-if="activeTabId === TabId.Search"
                :movies="movieList"
                :loading="isLoading"
                :error-message="error?.message"
    />

    <HistoryList v-else-if="activeTabId === TabId.History"/>

    <VodStreamers v-else-if="activeTabId === TabId.Vods"/>

    <PopularList v-else-if="activeTabId === TabId.Popular"/>

  </div>
</template>

<style scoped>
</style>