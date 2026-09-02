<script setup lang="ts">
import { computed } from 'vue'
import WindowHeader from './WindowHeader.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  headerIcon: {
    type: String,
    required: false
  },
  headerColorHex: {
    type: String,
    required: false
  },
  currentHeight: {
    type: Number,
  },
  currentWidth: {
    type: Number,
  },
  buttonEnabled: {
    type: Boolean,
    default: true
  },
})

defineEmits([
  'toggleWindow'
])

const windowStyle = computed(() => {
  if (!props.isOpen) {
    return {}
  }

  return {
    height: `${props.currentHeight}px`,
    width: `${props.currentWidth}px`
  }
})
</script>

<template>
  <div
      class="window-main"
      :style="windowStyle"
  >
    <WindowHeader
        :title="title"
        :headerIcon="headerIcon"
        :isOpen="isOpen"
        :headerColorHex="headerColorHex"
        :buttonEnabled="buttonEnabled"
        @toggleWindow="$emit('toggleWindow')"
    />
    <div v-if="isOpen" class="window-content">
      <slot/>
    </div>
  </div>
</template>
<style scoped>
.window-main {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 3px solid;
  border-color: #6a6a6a #4a4a4a #4a4a4a #6a6a6a;
  box-sizing: border-box;
  flex-shrink: 0;
}

.window-content {
  flex: 1;
  min-height: 0;
  border-top: 2px solid #3a3a3a;
  background: #2b2b2b;
  display: flex;
}
</style>