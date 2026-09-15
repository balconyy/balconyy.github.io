<script setup lang="ts">
interface Props {
  selectedLabel: string
}

defineProps<Props>()

defineEmits<{
  'open-player-modal': []
}>()
</script>

<template>
  <div class="players-list">
    <span>Источник:</span>
    <button
        class="player-btn"
        type="button"
        aria-label="Выбрать источник"
        @click="$emit('open-player-modal')"
    >
      {{ selectedLabel }}
    </button>
  </div>
</template>


<style scoped>
.players-list {
  color: white;
  display: flex;
  flex:1;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: 0;
  box-sizing: border-box;
}

.player-btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: left;
  background: rgba(48, 48, 48, 0.92);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 5px;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: left;
  font-size: 16px;
}

.player-btn:hover {
  background: var(--accent-color);
  border-color: var(--accent-color);
  box-shadow: 0 0 10px var(--accent-semi-transparent);
}

.player-btn:active {
  background: var(--accent-color);
  border-color: var(--accent-color);
}

.player-btn:focus {
  outline: none;
  box-shadow: 0 0 5px var(--accent-color);
}

</style>