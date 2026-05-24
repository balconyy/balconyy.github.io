<script setup>
import LogoMain from "@/components/logo/LogoMain.vue";
import Background from "@/components/Background.vue";
import GeekTelegram from "@/components/GeekTelegram.vue";
import SearchMain from "@/features/main/components/SearchMain.vue";
</script>

<template>
  <Background/>
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


</style>
