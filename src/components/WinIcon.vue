<script setup lang="ts">
import redirectIcon from "@/assets/icons/redirect-icon.png"

import {ref} from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Ярлык'
  },
  icon: {
    type: String,
    required: true
  },
  isShortcut: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['open'])

const isSelected = ref(false)

function selectIcon() {
  isSelected.value = true
}

function openIcon() {
  emit('open')
}
</script>

<template>
  <div
      class="win-icon"
      tabindex="0"
      @click="openIcon"
  >
    <div class="icon-image-wrapper">
      <img :src="icon" :alt="label" class="icon-image" draggable="false"/>
      <img class="shortcut-arrow" :src="redirectIcon" :alt="label"/>
    </div>
    <div class="icon-label">
      <span>{{ label }}</span>
    </div>
  </div>
</template>


<style scoped>
.win-icon {
  display: flex;
  width: fit-content;
  flex-direction: column;
  align-items: center;
  padding: 4px 2px;
  cursor: default;
  user-select: none;
  font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
}

.icon-image-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  image-rendering: pixelated;
}

.shortcut-arrow {
  position: absolute;
  left: -5px;
  bottom: -5px;
  width: 12px;
  height: 12px;
}

.icon-image {
  width: 36px;
  height: 36px;
}

.icon-label {
  margin-top: 5px;
  text-align: center;
  font-size: 12px;
  color: #ffffff;
  line-height: 1.2;
  padding: 1px 2px;
  word-break: break-word;
  max-width: 100%;
}

.win-icon:hover {
  outline: 1px dotted #ffffff;
}

</style>