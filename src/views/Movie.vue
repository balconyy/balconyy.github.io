<script setup>
import PlayerComponent from "@/features/player/components/PlayerComponent.vue";
import MovieInfo from "@/features/player/components/info/MovieInfo.vue";
import Background from "@/components/Background.vue";
import {ref, watch, watchEffect} from "vue";
import {useMovieInfo} from "@/features/player/composables/useMovieInfo.ts";
import RelationsList from "@/features/player/components/info/RelationsList.vue";
import {useRouter} from "vue-router";
import ReviewsList from "@/features/player/components/info/review/ReviewsList.vue";
import MovieInfoSkeleton from "@/features/player/components/info/MovieInfoSkeleton.vue";
import NavIcon from "@/components/navigation/NavIcon.vue";
import homeIcon from "@/assets/icons/home-icon.png";
import StreamerRatingList from "@/features/streamer/components/StreamerRatingList.vue";
import SidePanel from "@/components/window/SidePanel.vue";
import NavBar from "@/components/navigation/NavBar.vue";

const props = defineProps({
  kpId: {
    type: Number,
    required: true
  }
})

const kpId = ref(props.kpId);

const {
  movie,
  playerState,
  links,
  relations,
  reviewsResponse,
  ratings,
  isLoading,
  getMovieInfo,
} = useMovieInfo()


const onMovieClick = (movie) => {
  kpId.value = movie.kpId;
}


watchEffect(async () => {
  if (kpId) {
    await getMovieInfo(kpId.value)
  }
})

watch(movie, (newVal) => {
  document.title = `${newVal?.titleMain ?? 'Загрузка'} — Balcony`
})


</script>

<template>
  <Background/>
  <NavBar/>
  <SidePanel/>
  <MovieInfoSkeleton v-if="isLoading"/>
  <MovieInfo v-else-if="movie" :movie="movie" :links="links"/>
  <PlayerComponent :playerState="playerState"/>
  <StreamerRatingList :ratings="ratings"/>
  <RelationsList v-if="relations && relations.length"
                 :movies="relations"
                 @selectMovie="onMovieClick"/>
  <ReviewsList v-if="reviewsResponse && reviewsResponse.length"
               :reviewsResponse="reviewsResponse"
  />

</template>

<style scoped>
.home-icon {
  z-index: 10;
  position: fixed;
  margin: 16px 0 0 16px;
}
</style>

