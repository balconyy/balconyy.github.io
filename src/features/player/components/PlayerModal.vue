<script setup>
const props = defineProps({
  players: {
    type: Array,
    required: true
  },
  selectedPlayer: {
    type: Object,
    default: null
  }
})
const emit = defineEmits(['close', 'select'])

const selectPlayer = (player) => {
  emit('select', player)
  emit('close')
}

const isSelected = (player) => props.selectedPlayer?.name === player.name

</script>

<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close" @click="$emit('close')">&times;</button>

      <h2>Выберите плеер</h2>
      <ul class="players-list">
        <li v-for="player in players" :key="player.key ?? player.name">
          <button
              :class="['player-item', { active: isSelected(player) }]"
              @click="selectPlayer(player)"
          >
            {{ player.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.modal-content {
  background: #2d2d2d;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  color: #fff;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
}

h2 {
  margin-top: 0;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
}

.players-list {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}

.players-list li {
  margin: 8px 0;
}

.player-item {
  width: 100%;
  text-align: left;
  padding: 10px;
  background-color: #444;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.player-item:hover {
  background-color: var(--accent-transparent);
  border: 1px solid var(--accent-semi-transparent);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transform: translateY(-1px);
}

.player-item.active {
  background-color: var(--accent-color);
  box-shadow: 0 0 5px var(--accent-semi-transparent);
}

@media (max-width: 768px) {
  .modal-content {
    padding: 15px;
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .modal-content {
    max-width: 95%;
  }
}
</style>