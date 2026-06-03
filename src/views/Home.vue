<script setup>

import SearchMain from "@/features/search/components/SearchMain.vue";
import LogoMain from "@/components/logo/LogoMain.vue";
import GeekTelegram from "@/components/GeekTelegram.vue";
import DonationLine from "@/components/DonationLine.vue";
import AboutFooter from "@/components/AboutFooter.vue";
</script>

<template>
  <header>
    <LogoMain/>
  </header>

  <main>
    <SearchMain/>
  </main>

  <footer>
    <div class="page-wrapper">
      <div class="left"><DonationLine/></div>
      <div class="center"><GeekTelegram/></div>
      <div class="right"><AboutFooter/></div>
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