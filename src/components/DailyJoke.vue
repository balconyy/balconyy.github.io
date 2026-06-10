<script setup>
import {ref} from 'vue'
import {Minus} from '@lucide/vue';
import grinIcon from '@/assets/media/ebalo.png'
import ResizableContainer from "@/components/ResizableContainer.vue";

const isExpanded = ref(true)

const {url, defaultHeight, defaultWeight} = defineProps({
  url: {
    type: String,
    required: true
  },
  defaultHeight: {
    type: Number,
    required: true
  },
  defaultWeight: {
    type: Number,
    required: true
  }
})

const currentJoke = ref({
  image: url,
  alt: 'Прикол дня'
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}


</script>

<template>
  <div class="joke-container">

    <div class="forum-header">
      <img class="joke-icon" :class="{ hidden: !isExpanded }" :src="grinIcon" alt="">
      <span class="forum-title" :class="{ hidden: !isExpanded }">Прикол дня</span>
      <button @click="toggleExpand" class="trigger-btn">
        <Minus class="joke-icon" v-if="isExpanded"/>
        <img class="joke-icon" v-else :src="grinIcon" alt=""/>
      </button>
    </div>

    <ResizableContainer v-show="isExpanded" class="forum-content" :defaultHeight="defaultHeight"
                        :defaultWeight="defaultWeight">

      <img class="image-container"
           :src="currentJoke.image"
           :alt="currentJoke.alt"
      />

    </ResizableContainer>

  </div>

</template>

<style scoped>

.joke-container {
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

.forum-header {
  background: var(--accent-black);
  border-bottom: 2px solid #3a3a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 8px;
  width: 100%;
}

.forum-title {
  flex: 1;
  font-size: 14px;
  letter-spacing: 1px;
  color: white;
}

.forum-title.hidden {
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

.forum-content {
  background: #1e1e1e;
}

.image-container {
  width: 90%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;
}

</style>