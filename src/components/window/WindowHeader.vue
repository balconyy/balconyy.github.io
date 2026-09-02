<script setup lang="ts">
import {Minus} from "@lucide/vue";

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  headerIcon: {
    type: String,
    required: false
  },
  headerColorHex: {
    type: String,
    default: "#211731"
  },
  buttonEnabled: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits([
  'toggleWindow'
])
</script>

<template>
  <div class="window-header" :style="{ background: headerColorHex }">
    <img v-if="headerIcon"
         class="window-icon"
         :class="{ hidden: !isOpen }"
         :src="headerIcon"
         alt="icon"
    />


    <span class="window-title" :class="{ hidden: !isOpen }">
      {{ title }}
    </span>


    <button v-if="buttonEnabled" class="close-button" @click="emit('toggleWindow')">
      <Minus v-if="isOpen" class="window-icon"/>
      <img v-else-if="headerIcon"
           class="window-icon"
           :src="headerIcon"
           alt=""/>

    </button>

  </div>
</template>


<style scoped>
.window-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 8px;
  width: 100%;

}


.window-title {
  flex: 1;
  font-size: 14px;
  letter-spacing: 1px;
  font-family: Tahoma, "MS Sans Serif", sans-serif;
  color: #f2f2f2;
}


.window-title.hidden {
  display: none;
}


.window-icon {
  width: 24px;
  height: 24px;
  margin: 0 auto;
  display: block;

}


.window-icon.hidden {
  display: none;
}


.close-button {
  all: unset;
  background: #3a3a3a;
  border: 2px solid;
  border-color: #5a5a5a #2a2a2a #2a2a2a #5a5a5a;
  color: var(--ui-light);
  cursor: pointer;
}


.close-button:hover {
  background: #4a4a4a;
  color: #fff;
}


.close-button:active {
  transform: scale(.95);
}


</style>