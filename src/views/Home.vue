<script setup lang="ts">

import SearchMain from "@/features/search/components/SearchMain.vue";
import LogoMain from "@/components/logo/LogoMain.vue";
import GeekTelegram from "@/components/GeekTelegram.vue";
import DonationLine from "@/components/DonationLine.vue";
import AboutBlock from "@/components/AboutBlock.vue";
import Background from "@/components/Background.vue";
import AdminAlert from "@/components/AdminAlert.vue";

import {onMounted} from "vue";
import {useHead} from "@vueuse/head";
import RecentlyWatchList from "@/features/resently/components/RecentlyWatchList.vue";

import {useRouter} from "vue-router";
import {useConfigResults} from "@/features/admin/composables/config/useConfigResults";
import {useRecentlyWatch} from "@/features/resently/composables/useRecentlyWatch";
import {Movie} from "@/models/movie";
import SidePanel from "@/components/SidePanel.vue";


useHead({
  title: 'Главная — Balcony',
  meta: [
    {
      name: 'description',
      content: 'Поиск фильмов по названию и id, история просмотров, прикол дня'
    }
  ]
})

const {
  isConfigLoaded,
  donation,
  adminAlert
} = useConfigResults();

const {
  recentlyWatched,
  getRecentlyWatch
} = useRecentlyWatch()

const router = useRouter()
const onMovieClick = (movie: Movie) => {
  router.push({
    name: 'movie',
    params: {kpId: movie.kpId},
  })
}


onMounted(() => {
  getRecentlyWatch()
})
</script>

<template>
  <Background/>
  <header>
    <LogoMain/>
    <AdminAlert v-if="isConfigLoaded && adminAlert?.message"
                :message="adminAlert.message"
                :link="adminAlert.link"/>
  </header>

  <main>
    <SidePanel/>

    <SearchMain @selectMovie="onMovieClick"/>

    <RecentlyWatchList v-if="recentlyWatched && recentlyWatched.movies.length + recentlyWatched.serials.length > 0"
                       :recentlyLists="recentlyWatched"
                       @selectMovie="onMovieClick"/>
  </main>

  <footer>
    <div class="page-wrapper">
      <div class="left">
        <DonationLine v-if="isConfigLoaded && donation"
                      :donationText="donation.donationText"
                      :currentValue="donation.moneyNow"
                      :goalValue="donation.moneyTotal"
        />
      </div>
      <div class="center">
        <GeekTelegram/>
      </div>
      <div class="right">
        <AboutBlock/>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.page-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  width: 100%;
  align-items: flex-end;
  padding-bottom: 10px;
}

.left {
  justify-self: center;
}

.center {
  justify-self: center;
}

.right {
  justify-self: center;
}

footer {
  padding-bottom: 130px;
}
</style>