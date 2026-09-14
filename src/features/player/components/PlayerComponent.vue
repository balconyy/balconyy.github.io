<script setup lang="ts">
import {toRef} from 'vue'

import ErrorScreen from '@/components/ErrorScreen.vue'
import {usePlayerSources} from '@/features/player/composables/usePlayerSources'
import PlayerContainer from '@/features/player/components/PlayerContainer.vue'
import PlayerModal from '@/features/player/components/PlayerModal.vue'
import PlayerSelectorBar from '@/features/player/components/PlayerSelectorBar.vue'
import {PlayerState} from "@/models/playerModels";

interface Props {
  playerState: PlayerState
}

const props = defineProps<Props>()

const {
  players,
  selectedPlayer,
  showPlayerModal,
  errorMessage,
  playersEmptyMessage,
  selectedPlayerLabel,
  selectPlayer,
  openPlayerModal,
  closePlayerModal,
} = usePlayerSources(toRef(props, 'playerState'))
</script>

<template>
  <ErrorScreen v-if="errorMessage" :message="errorMessage"/>

  <template v-else>
    <PlayerSelectorBar
        :selected-label="selectedPlayerLabel"
        @open-player-modal="openPlayerModal"
    />

    <PlayerModal
        v-if="showPlayerModal"
        :players="players"
        :selected-player="selectedPlayer"
        @close="closePlayerModal"
        @select="selectPlayer"
    />

    <PlayerContainer
        :selected-player="selectedPlayer"
        :players-empty-message="playersEmptyMessage"
    />
  </template>
</template>