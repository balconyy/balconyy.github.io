<script setup lang="ts">
import {ref} from 'vue'
import {Check, Lock} from '@lucide/vue'
import {BlobCustomizationDto} from "@/data/dto/blobCustomizationDto";

const props = defineProps<{
  items: BlobCustomizationDto[]
}>()

const emit = defineEmits<{
  (e: 'change', item: BlobCustomizationDto): void
  (e: 'hold', item: BlobCustomizationDto | null): void
}>()

const selectedId = ref(props.items.find(i => i.isSelected)?.id ?? null)

function handleClick(item: BlobCustomizationDto) {
  if (!item.isUnlocked) return
  selectedId.value = item.id
  emit('change', item)
}

function handleMouseEnter(item: BlobCustomizationDto) {
  emit('hold', item)
}

function handleMouseLeave() {
  emit('hold', null)
}
</script>

<template>
  <div class="customization-list">
    <button
        v-for="item in items"
        :key="item.id"
        class="customization-el"
        :style="{ backgroundImage: `url(${item.image})`}"
        :class="{
          'customization-el--selected': selectedId === item.id,
          'customization-el--locked': !item.isUnlocked,
        }"
        :disabled="!item.isUnlocked"
        @click="handleClick(item)"
        @pointerenter="handleMouseEnter(item)"
        @pointerleave="handleMouseLeave"
    >
      <span v-if="!item.isUnlocked" class="customization-el__overlay">
        <Lock :size="14" stroke-width="2.4"/>
      </span>
      <span v-else-if="selectedId === item.id" class="customization-el__overlay">
        <Check :size="14" stroke-width="2.8"/>
      </span>
    </button>
  </div>
</template>

<style scoped>
.customization-list {
  flex: 1 1 auto;
  min-height: 0;
  align-content: flex-start;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-gutter: stable;
  margin: 0;
  padding: 4px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 44px);
  justify-content: center;
  gap: 16px;
  max-width: 100%;
  scrollbar-width: thin;
  scrollbar-color: #2b2d31 #1f1f1f;
}

.customization-el {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--ui-color);
  background-color: #1f1f1f;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  transition: transform 0.15s ease, border-color 0.15s ease;
  outline-offset: 3px;
}

.customization-el:hover {
  transform: scale(1.08);
}

.customization-el:active {
  transform: scale(0.96);
}

.customization-el--selected {
  border-color: #ccc;
}

.customization-el--locked:hover {
  transform: none;
}

.customization-el__overlay {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--ui-color);
}

.customization-el--locked .customization-el__overlay {
  position: relative;
  filter: drop-shadow(0px 0px 1px rgba(0,0,0,0.9));
  z-index: 1;
}
</style>