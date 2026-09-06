<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from "vue";
import ChatWindow from "@/features/chat/components/ChatWindow.vue";
import JellyBlobWindow from "@/features/blob/components/JellyBlobWindow.vue";

const isBlobOpen = ref(true)
const isChatOpen = ref(true)

function toggleJokeWindow() {
  isBlobOpen.value = !isBlobOpen.value
}

function toggleChatWindow() {
  isChatOpen.value = !isChatOpen.value
}

const MIN_HEIGHT = 150
const MIN_COLUMN_WIDTH = 280
const MAX_COLUMN_WIDTH = 800
const COLUMN_GAP = 8

const columnRef = ref<HTMLElement | null>(null)
const totalHeight = ref(0)
const heightTop = ref(0)
const heightBottom = ref(0)
const columnWidth = ref(0)

function recalcTotal() {
  if (!columnRef.value) return
  const prevTotal = heightTop.value + heightBottom.value
  totalHeight.value = columnRef.value.clientHeight - COLUMN_GAP
  const ratio = prevTotal > 0 ? heightTop.value / prevTotal : 0.5
  heightTop.value = Math.max(MIN_HEIGHT, totalHeight.value * ratio)
  heightBottom.value = Math.max(MIN_HEIGHT, totalHeight.value - heightTop.value)
}

let observer: ResizeObserver
onMounted(() => {
  columnWidth.value = Math.min(
      MAX_COLUMN_WIDTH,
      Math.max(MIN_COLUMN_WIDTH, window.innerWidth * 0.3)
  )
  recalcTotal()
  observer = new ResizeObserver(() => recalcTotal())
  observer.observe(columnRef.value!!)
})
onBeforeUnmount(() => {
  observer?.disconnect()
})

function applyHeightDelta(which: 'top' | 'bottom', delta: number) {
  let newTop = heightTop.value
  let newBottom = heightBottom.value
  if (which === 'top') newTop += delta
  else newBottom += delta
  if (which === 'top') {
    newTop = Math.min(Math.max(newTop, MIN_HEIGHT), totalHeight.value - MIN_HEIGHT)
    newBottom = totalHeight.value - newTop
  } else {
    newBottom = Math.min(Math.max(newBottom, MIN_HEIGHT), totalHeight.value - MIN_HEIGHT)
    newTop = totalHeight.value - newBottom
  }
  heightTop.value = newTop
  heightBottom.value = newBottom
}

function applyWidthDelta(dx: number) {
  columnWidth.value = Math.min(
      MAX_COLUMN_WIDTH,
      Math.max(MIN_COLUMN_WIDTH, columnWidth.value - dx)
  )
}

function onTopResize({dx, dy}: { dx: number; dy: number }) {
  applyWidthDelta(dx)
  applyHeightDelta('top', dy)
}

function onBottomResize({dx, dy}: { dx: number; dy: number }) {
  applyWidthDelta(dx)
  const resultY = isBlobOpen.value ? -dy : dy
  applyHeightDelta('bottom', resultY)
}
</script>

<template>
  <div class="windows-column" ref="columnRef">
    <JellyBlobWindow
        :currentHeight="heightTop"
        :currentWidth="columnWidth"
        :isOpen="isBlobOpen"
        @resize="onTopResize"
        @toggleWindow="toggleJokeWindow"
    />
    <ChatWindow
        :isOpen="isChatOpen"
        :currentHeight="heightBottom"
        :currentWidth="columnWidth"
        scope="cinema"
        @toggleWindow="toggleChatWindow"
        @resize="onBottomResize"
    />
  </div>
</template>

<style scoped>
.windows-column {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 8px;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.windows-column > * {
  pointer-events: auto;
}
</style>