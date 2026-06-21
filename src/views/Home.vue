<script setup lang="ts">

import SearchMain from "@/features/search/components/SearchMain.vue";
import LogoMain from "@/components/logo/LogoMain.vue";
import GeekTelegram from "@/components/GeekTelegram.vue";
import DonationLine from "@/components/DonationLine.vue";
import AboutBlock from "@/components/AboutBlock.vue";
import Background from "@/components/Background.vue";
import AdminAlert from "@/components/AdminAlert.vue";
import DailyJoke from "@/components/DailyJoke.vue";

import {onMounted} from "vue";
import {useHead} from "@vueuse/head";
import RecentlyWatchList from "@/features/resently/components/RecentlyWatchList.vue";

import {useRouter} from "vue-router";
import {useConfigResults} from "@/features/admin/composables/config/useConfigResults";
import {useDailyWindow} from "@/features/admin/composables/config/useDailyWindow";
import {useRecentlyWatch} from "@/features/resently/composables/useRecentlyWatch";
import {Movie} from "@/models/movie";


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
  dailyJokeUrl,
  minHeight,
  currentHeight,
  isOpen,
  initDailyScreen,
  changeWindowState,
  setWindowHeight
} = useDailyWindow()

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
  initDailyScreen()
  getRecentlyWatch()
})
</script>

<template>
  <Background/>
  <header>
    <LogoMain/>
    <AdminAlert v-if="isConfigLoaded && adminAlert.message"
                :message="adminAlert.message"
                :link="adminAlert.link"/>
  </header>

  <main>
    <DailyJoke v-if="dailyJokeUrl"
               :url="dailyJokeUrl"
               :currentHeight="currentHeight"
               :minHeight="minHeight"
               :isOpen="isOpen"
               @stopResizing="setWindowHeight"
               @buttonClicked="changeWindowState"
    />
    <SearchMain @selectMovie="onMovieClick"/>

    <RecentlyWatchList v-if="recentlyWatched && recentlyWatched.length"
                       :movies="recentlyWatched"
                       @selectMovie="onMovieClick"/>
  </main>

  <footer>
    <div class="page-wrapper">
      <div class="left">
        <DonationLine v-if="isConfigLoaded"
                      :donation-text="donation.donationText"
                      :current-value="donation.moneyNow"
                      :goal-value="donation.moneyTotal"
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