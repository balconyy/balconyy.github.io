<script setup>
import MovieSearch from '@/features/search/components/MovieSearch.vue'
import LogoHeader from "@/components/LogoHeader.vue";
import Background from "@/components/Background.vue";
</script>

<template>
  <Background/>
  <header>
    <LogoHeader/>
  </header>

  <main>
    <MovieSearch/>
  </main>
</template>

<style scoped>


</style>
