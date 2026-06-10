<script setup>

import SearchMain from "@/features/search/components/SearchMain.vue";
import LogoMain from "@/components/logo/LogoMain.vue";
import GeekTelegram from "@/components/GeekTelegram.vue";
import DonationLine from "@/components/DonationLine.vue";
import AboutBlock from "@/components/AboutBlock.vue";
import Background from "@/components/Background.vue";
import {useRemoteConfigStore} from "@/store/remoteConfig.ts";
import {computed} from "vue";
import AdminAlert from "@/components/AdminAlert.vue";
import DailyJoke from "@/components/DailyJoke.vue";

const configStore = useRemoteConfigStore();
const isConfigLoaded = computed(() => configStore.loaded);
const donation = computed(() => configStore.remoteConfig.donationInfo);
const adminAlert = computed(() => configStore.remoteConfig.adminAlert);
const dailyJoke = computed(() => configStore.remoteConfig.dailyJoke);
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
    <DailyJoke v-if="isConfigLoaded && dailyJoke.url"
               :url="dailyJoke.url"
               :defaultHeight="dailyJoke.height"
               :defaultWeight="dailyJoke.width"
    />
    <SearchMain/>
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
  padding-bottom: 120px;
}
</style>