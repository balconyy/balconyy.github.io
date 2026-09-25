<script setup lang="ts">
import {toRef} from 'vue'

import ErrorScreen from '@/components/ErrorScreen.vue'
import PlayerContainer from '@/features/player/components/PlayerContainer.vue'
import PlayerModal from '@/features/player/components/PlayerModal.vue'
import PlayerSelectorBar from '@/features/player/components/PlayerSelectorBar.vue'
import PlayerToggle from '@/features/player/components/PlayerToggle.vue'
import {useSelectorModal} from '@/features/player/composables/useSelectorModal'
import type {PlayerSelectorItem, PlayerState, PlayerType} from '@/models/playerModels'
import {usePlayerSources} from "@/features/player/composables/playerSource/usePlayerSources";

interface Props {
  type: PlayerType
  playerState?: PlayerState
  kpId?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'movie'
})

// Весь стейт текущего типа и его реализация — в одном месте.
// Здесь остаётся только разводка данных по компонентам.
const {
  isVodMode,
  isToggleVisible,
  items,
  selectedKey,
  selectedLabel,
  mediaComponent,
  mediaId,
  mediaUrl,
  loadingText,
  overlay,
  isLoading,
  emptyMessage,
  errorMessage,
  select,
} = usePlayerSources({
  initialType: toRef(props, 'type'),
  playerState: toRef(props, 'playerState'),
  kpId: toRef(props, 'kpId'),
})

const {showModal, openModal, closeModal} = useSelectorModal()

const onSelect = (item: PlayerSelectorItem): void => select(item.key)
</script>

<template>
  <ErrorScreen v-if="errorMessage" :message="errorMessage"/>

  <template v-else>
    <div class="player-controls-row">
      <PlayerSelectorBar
          :selected-label="selectedLabel"
          @open-player-modal="openModal"
      />

      <PlayerToggle
          v-if="isToggleVisible"
          v-model="isVodMode"
          off-label="Плеер"
          on-label="Vod"
      />
    </div>

    <PlayerModal
        v-if="showModal"
        :items="items"
        :selected-key="selectedKey"
        @close="closeModal"
        @select="onSelect"
    />

    <PlayerContainer
        :media-component="mediaComponent"
        :media-id="mediaId"
        :media-url="mediaUrl"
        :loading-text="loadingText"
        :overlay="overlay"
        :is-loading="isLoading"
        :empty-message="emptyMessage"
    />
  </template>
</template>

<style scoped>
.player-controls-row {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 480px;
  margin: 10px auto 18px;
  gap: 10px;
}
</style>