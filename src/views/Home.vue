<script setup>

import SearchMain from "@/features/search/components/SearchMain.vue";
import LogoMain from "@/components/logo/LogoMain.vue";
import GeekTelegram from "@/components/GeekTelegram.vue";
import DonationLine from "@/components/DonationLine.vue";
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
      <div class="right"></div>
    </div>
  </footer>
</template>

<style scoped>
.page-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: 1fr 1fr auto 1fr 1fr;
  align-items: flex-end;
  z-index: 3;
  box-sizing: border-box;
  padding-bottom: 10px;
}

.left {
  grid-column: 1 / 3;
  justify-self: center;
  padding-right: 90px;
}

.center {
  grid-column: 3 / 4;
  justify-self: center;
}

.right {
  grid-column: 4 / 6;
  justify-self: center;
}

footer {
  padding-bottom: 120px;
}
</style>