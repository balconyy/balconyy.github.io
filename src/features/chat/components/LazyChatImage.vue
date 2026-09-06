<script setup lang="ts">
import {inject, onBeforeUnmount, onMounted, ref, type Ref} from 'vue';
import {useImageLoadQueue} from "@/features/chat/composables/UseImageLoadQueue";


const props = defineProps<{
  src: string;
}>();

const container = ref<HTMLElement | null>(null);
const actualSrc = ref<string | null>(null);
const isLoaded = ref(false);
const hasError = ref(false);

// chatScrollRoot прокидывается родителем (ChatList) через provide —
// это сам скролл-контейнер .chat-log, а не window/viewport.
const scrollRootRef = inject<Ref<HTMLElement | null>>('chatScrollRoot', ref(null));
const {enqueue, release} = useImageLoadQueue();

let observer: IntersectionObserver | null = null;
let started = false;

function startLoad() {
  if (started) return;
  started = true;
  enqueue(() => {
    actualSrc.value = props.src;
  });
}

function onImgLoad() {
  isLoaded.value = true;
  release();
}

function onImgError() {
  hasError.value = true;
  release();
}

function openOriginal() {
  window.open(props.src, '_blank', 'noopener,noreferrer');
}

onMounted(() => {
  observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startLoad();
            observer?.unobserve(entry.target);
          }
        }
      },
      {
        root: scrollRootRef.value,
        // подгружаем чуть заранее, до появления в зоне видимости
        rootMargin: '200px 0px',
        threshold: 0.01,
      }
  );

  if (container.value) {
    observer.observe(container.value);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <span ref="container" class="lazy-image-wrap"
  ><img
      v-if="actualSrc"
      :src="actualSrc"
      class="chat-image"
      :class="{ 'is-loaded': isLoaded }"
      decoding="async"
      alt=""
      @load="onImgLoad"
      @error="onImgError"
      @click="openOriginal"
  /><a
      v-else-if="hasError"
      :href="src"
      target="_blank"
      rel="noopener noreferrer"
      class="chat-image-fallback"
  >{{ src }}</a
  ><span v-else class="chat-image-placeholder"></span
  ></span>
</template>

<style scoped>
.lazy-image-wrap {
  display: inline-block;
  vertical-align: middle;
}

.chat-image-placeholder {
  display: inline-block;
  width: 96px;
  height: 72px;
  border-radius: 4px;
  background: #2b2d31;
  vertical-align: middle;
}

.chat-image {
  display: inline-block;
  max-width: 320px;
  max-height: 240px;
  border-radius: 4px;
  cursor: pointer;
  vertical-align: middle;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.chat-image.is-loaded {
  opacity: 1;
}

.chat-image-fallback {
  color: #72767d;
  text-decoration: underline;
  word-break: break-all;
}
</style>