<script setup lang="ts">
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
  }
})

defineEmits([
  'toggleWindow'
])

</script>

<template>
  <div class="window-main">
    <WindowHeader
        :title="title"
        :headerIcon="headerIcon"
        :isOpen="isOpen"
        :headerColorHex="headerColorHex"
        @toggleWindow="$emit('toggleWindow')"
    />

    <div v-show="isOpen" class="window-content">
      <slot/>
    </div>

  </div>
</template>

<style scoped>
.window-main {
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  border: 3px solid;
  border-color: #6a6a6a #4a4a4a #4a4a4a #6a6a6a;
}


.window-content {
  border-top: 2px solid #3a3a3a;
  background: #1e1e1e;
}

</style>