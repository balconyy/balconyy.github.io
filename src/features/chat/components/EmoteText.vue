<script setup lang="ts">
import {computed, inject, nextTick, watch} from 'vue';
import {useEmotes} from '@/features/chat/composables/useEmotes';
import {type Emote, parseEmotes} from '@/utils/emotes';

const props = defineProps<{
  text: string;
}>();

const {emotes} = useEmotes();

const parts = computed(() => parseEmotes(props.text, emotes.value));


const notifyChatResize = inject<(() => void) | null>('notifyChatResize', null);

watch(parts, () => {
  nextTick(() => notifyChatResize?.());
});

function titleOf(stack: Emote[]): string {
  return stack.map(e => e.name).join(' ');
}
</script>

<template>
  <span><template v-for="(part, i) in parts" :key="i">
    <template v-if="part.type === 'text'">{{ part.value }}</template>
    <span v-else class="emote" :title="titleOf(part.emotes)">
      <img
          v-for="(emote, j) in part.emotes"
          :key="j"
          :src="emote.url"
          :alt="emote.name"
          :style="{ aspectRatio: `${emote.width} / ${emote.height}` }"
          loading="lazy"
          decoding="async"
          draggable="false"
          @load="notifyChatResize?.()"
      />
    </span>
  </template></span>
</template>

<style scoped>
.emote {
  display: inline-grid;
  place-items: center;
  vertical-align: middle;
  margin: 1px 0;
}

.emote img {
  grid-area: 1 / 1;
  height: 28px;
  width: auto;
  max-width: none;
}
</style>