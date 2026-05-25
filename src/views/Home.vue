<script setup>

import SearchMain from "@/features/main/components/SearchMain.vue";
import LogoMain from "@/components/logo/LogoMain.vue";
import GeekTelegram from "@/components/GeekTelegram.vue";
</script>

<template>
  <header>
    <LogoMain/>
  </header>

  <main>
    <SearchMain/>
  </main>

  <footer>
    <GeekTelegram/>
  </footer>
</template>

<style scoped>
footer {
  padding-bottom: 120px;
}
</style>