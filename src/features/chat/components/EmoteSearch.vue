<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {useEmotes} from '@/features/chat/composables/useEmotes';
import type {Emote} from '@/utils/emotes';

const MAX_SUGGESTIONS = 5;

const props = defineProps<{
  text: string;
  caret: number;
}>();

const emit = defineEmits<{
  apply: [text: string, caret: number];
}>();

const {emotes} = useEmotes();

const activeIndex = ref(0);
const closedManually = ref(false);

interface EmoteQuery {
  start: number;
  query: string;
}


function findEmoteQuery(text: string, caretPos: number): EmoteQuery | null {
  const uptoCaret = text.slice(0, caretPos);
  const match = uptoCaret.match(/(?:^|\s)(:[^\s:]*)$/);
  if (!match) return null;

  const token = match[1];
  return {
    start: uptoCaret.length - token.length,
    query: token.slice(1),
  };
}

const emoteQuery = computed(() => findEmoteQuery(props.text, props.caret));


watch(emoteQuery, (curr, prev) => {
  if (curr && !prev) closedManually.value = false;
});

const suggestions = computed<Emote[]>(() => {
  const q = emoteQuery.value;
  if (!q || closedManually.value) return [];

  const query = q.query.toLowerCase();
  const list = Array.from(emotes.value.values());
  const byName = (a: Emote, b: Emote) => a.name.localeCompare(b.name);

  if (!query) {
    return [...list].sort(byName).slice(0, MAX_SUGGESTIONS);
  }

  const starts: Emote[] = [];
  const contains: Emote[] = [];
  for (const emote of list) {
    const name = emote.name.toLowerCase();
    if (name.startsWith(query)) starts.push(emote);
    else if (name.includes(query)) contains.push(emote);
  }

  return [...starts.sort(byName), ...contains.sort(byName)].slice(0, MAX_SUGGESTIONS);
});

const showSuggestions = computed(() => suggestions.value.length > 0);

watch(suggestions, (list) => {
  if (activeIndex.value >= list.length) activeIndex.value = 0;
});

function applySuggestion(emote: Emote) {
  const q = emoteQuery.value;
  if (!q) return;

  const before = props.text.slice(0, q.start);
  const after = props.text.slice(q.start + 1 + q.query.length); // +1 — сам символ ":"
  const insertion = `${emote.name} `;

  emit('apply', before + insertion + after, before.length + insertion.length);
}


function handleKeydown(e: KeyboardEvent): boolean {
  if (!showSuggestions.value) return false;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      activeIndex.value = (activeIndex.value + 1) % suggestions.value.length;
      return true;
    case 'ArrowUp':
      e.preventDefault();
      activeIndex.value = (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length;
      return true;
    case 'Tab':
    case 'Enter':
      e.preventDefault();
      applySuggestion(suggestions.value[activeIndex.value]);
      return true;
    case 'Escape':
      e.preventDefault();
      closedManually.value = true;
      return true;
    default:
      return false;
  }
}

defineExpose({handleKeydown});
</script>

<template>
  <div v-if="showSuggestions" class="emote-suggestions">
    <div
        v-for="(s, i) in suggestions"
        :key="s.name"
        class="emote-suggestion"
        :class="{ active: i === activeIndex }"
        @mousedown.prevent="applySuggestion(s)"
        @mouseenter="activeIndex = i"
    >
      <img :src="s.url" :alt="s.name" class="emote-suggestion-icon"/>
      <span class="emote-suggestion-name">{{ s.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.emote-suggestions {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 100%;
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #2b2d31 #1f1f1f;
  background: #1e1e1e;
  border-top: 2px solid #4a4a4a;
  border-right: 2px solid #2a2a2a;
  border-left: 2px solid #4a4a4a;
  z-index: 20;
}

.emote-suggestion {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  cursor: pointer;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  color: #dcddde;
}

.emote-suggestion:hover,
.emote-suggestion.active {
  background: #3a3a3a;
}

.emote-suggestion-icon {
  height: 24px;
  width: auto;
  flex-shrink: 0;
}

.emote-suggestion-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>