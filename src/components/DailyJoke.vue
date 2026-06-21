<script setup>
import {Minus} from '@lucide/vue';
import grinIcon from '@/assets/media/ebalo.png'
import ResizableContainer from "@/components/ResizableContainer.vue";
import {ref} from "vue";


const {url, currentHeight, minHeight, isOpen} = defineProps({
  url: {
    type: String,
    required: true
  },
  currentHeight: {
    type: Number,
    required: true
  },
  minHeight: {
    type: Number,
    required: true
  },
  isOpen: {
    type: Boolean,
    required: true
  },
})
const isWindowOpen = ref(isOpen);
const imgBlocked = ref(false)

const emit = defineEmits(['stopResizing', 'buttonClicked'])

function stopResizing(height) {
  emit('stopResizing', height)
}

function buttonClicked() {
  isWindowOpen.value = !isWindowOpen.value;
  emit('buttonClicked', isWindowOpen.value)
}

function onImgError() {
  imgBlocked.value = true
}
</script>

<template>
  <div v-if="!imgBlocked" class="joke-main">
    <div class="joke-header">
      <img class="joke-icon" :class="{ hidden: !isOpen }" :src="grinIcon" alt="">
      <span class="joke-title" :class="{ hidden: !isOpen }">Прикол дня</span>
      <button @click="buttonClicked" class="trigger-btn">
        <Minus class="joke-icon" v-if="isOpen"/>
        <img class="joke-icon" v-else :src="grinIcon" alt=""/>
      </button>
    </div>

    <ResizableContainer v-show="isOpen" class="joke-content"
                        :currentHeight="currentHeight"
                        :minHeight="minHeight"
                        @stopResizing="stopResizing">

      <img class="joke-container"
           :src="url"
           @error="onImgError"
           alt="Прикол дня"
      />

    </ResizableContainer>

  </div>

</template>

<style scoped>

.joke-main {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  width: fit-content;
  background: #2a2a2a;
  border: 3px solid;
  border-color: #6a6a6a #4a4a4a #4a4a4a #6a6a6a;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.joke-header {
  background: var(--accent-black);
  border-bottom: 2px solid #3a3a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 8px;
  width: 100%;
}

.joke-title {
  flex: 1;
  font-size: 14px;
  letter-spacing: 1px;
  color: white;
}

.joke-title.hidden {
  display: none;
}

.joke-icon {
  width: 20px;
  height: 20px;
  margin: 0 auto;
  display: block;
}

.joke-icon.hidden {
  display: none;
}

.trigger-btn {
  all: unset;
  background: #2a2a2a;
  border: 2px solid #4a4a4a;
  color: var(--ui-light);
  cursor: pointer;
}

.trigger-btn:hover {
  background: #3a3a3a;
  color: #fff;
}

.trigger-btn:active {
  transform: scale(0.95);
}

.joke-content {
  background: #1e1e1e;
}

.joke-container {
  width: 100%;
  height: 100%;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;
}

</style>