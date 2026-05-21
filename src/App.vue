<script setup>
import MovieSearch from '@/features/search/components/MovieSearch.vue'
import LogoMain from "@/components/logo/LogoMain.vue";
import Background from "@/components/Background.vue";
import GeekTelegram from "@/components/GeekTelegram.vue";
</script>

<template>
  <Background/>
  <header>
    <LogoMain/>
  </header>

  <main>
    <MovieSearch/>
  </main>

  <footer>
    <GeekTelegram/>
  </footer>
</template>

<style scoped>


</style>
