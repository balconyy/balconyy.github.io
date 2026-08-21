<script setup lang="ts">

import {useLeaderboard} from "@/features/blob/composables/useLeaderboard";
import {onMounted} from "vue";
import JellyBlobUser from "@/features/blob/components/JellyBlobUser.vue";

const {
  leaderboard,
  isLoading,
  getLeaderboard
} = useLeaderboard()

onMounted(() => {
  getLeaderboard()
})

</script>

<template>
  <div class= "leaderboard">
    <JellyBlobUser class="leader-row"
        v-for="row in leaderboard"
        :row="row"
    />
  </div>

</template>

<style scoped>

.leaderboard {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  padding: 6px 4px;
  color: #dcddde;
  overflow-y: auto;
  border-left: 2px solid #2a2a2a;
  border-right: 2px solid #4a4a4a;
  border-bottom: 2px solid #4a4a4a;
  background: #1f1f1f;
  scrollbar-width: thin;
  scrollbar-color: #2b2d31 #1f1f1f;
}

.leader-row {
  padding: 2px 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: break-word;
  min-width: 0;
}

.leaderboard::-webkit-scrollbar {
  width: 10px;
}

.leaderboard::-webkit-scrollbar-track {
  background: #1f1f1f;
}

.leaderboard::-webkit-scrollbar-thumb {
  background-color: #2b2d31;
  border-radius: 8px;
  border: 2px solid #1f1f1f;
}

.leaderboard::-webkit-scrollbar-thumb:hover {
  background-color: #35373c;
}


</style>