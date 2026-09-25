<script setup lang="ts">

import {onMounted} from "vue";
import {useRoute} from "vue-router";

import SidePanel from "@/components/window/SidePanel.vue";
import NavBar from "@/components/navigation/NavBar.vue";
import Background from "@/components/Background.vue";
import {useMovieVods} from "@/features/streamer/composables/useMovieVods";
import VodMovieList from "@/features/streamer/components/vods/VodMovieList.vue";

// Предполагается, что маршрут вида /streamer/:nickname —
// поправьте имя параметра, если оно называется иначе
const route = useRoute()
const nickname = route.params.nickname as string

const {vods, isLoading, error, page, hasNextPage, getStreamerVods} = useMovieVods()

onMounted(() => {
  getStreamerVods(nickname)
})

function onUpdatePage(newPage: number) {
  getStreamerVods(nickname, newPage)
}

</script>

<template>
  <Background/>
  <NavBar/>
  <SidePanel/>

  <main class="streamer-content">
    <VodMovieList
        :vods="vods"
        :page="page"
        :loading="isLoading"
        :error-message="error?.message"
        :has-next-page="hasNextPage"
        @update:page="onUpdatePage"
    />
  </main>
</template>

<style scoped>
.streamer-content {
  padding: 24px;
}
</style>