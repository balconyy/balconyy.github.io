<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from 'vue'
import {WindowsSetting} from "@/store/windows";

const props = withDefaults(
    defineProps<{
      isJokeOpen: boolean,
      windowsSetting: WindowsSetting,
      minHeightTop?: number
      minHeightBottom?: number
      minWidthTop?: number
      minWidthBottom?: number
      maxWidthTop?: number
      maxWidthBottom?: number
    }>(), {
      minHeightTop: 100,
      minHeightBottom: 100,
      minWidthTop: 100,
      minWidthBottom: 200,
      maxWidthTop: 800,
      maxWidthBottom: 800,
    })
const containerRef = ref<HTMLElement | null>(null)
const totalHeight = ref(0)
const heightTop = ref(props.windowsSetting.heightTop)
const heightBottom = ref(props.windowsSetting.heightBottom)
const widthTop = ref(props.windowsSetting.widthTop)
const widthBottom = ref(props.windowsSetting.widthBottom)

function recalcTotal() {
  if (!containerRef.value) return
  const prevTotal = heightTop.value + heightBottom.value
  totalHeight.value = containerRef.value.clientHeight - 16
  const ratio = prevTotal > 0 ? heightTop.value / prevTotal : 0.5
  heightTop.value = Math.max(props.minHeightTop, totalHeight.value * ratio)
  heightBottom.value = Math.max(props.minHeightBottom, totalHeight.value - heightTop.value)
}

let observer: ResizeObserver
onMounted(() => {
  recalcTotal()
  observer = new ResizeObserver(() => recalcTotal())
  observer.observe(containerRef.value!!)
})
onBeforeUnmount(() => {
  observer?.disconnect()
})

const emit = defineEmits<{
  windowChange: [{
    widthTop: number
    heightTop: number
    widthBottom: number
    heightBottom: number
  }]
}>()


function applyHeightDelta(which: 'top' | 'bottom', delta: number) {
  let newTop = heightTop.value
  let newBottom = heightBottom.value
  if (which === 'top') newTop += delta
  else newBottom += delta
  if (which === 'top') {
    newTop = Math.min(Math.max(newTop, props.minHeightTop), totalHeight.value - props.minHeightBottom)
    newBottom = totalHeight.value - newTop
  } else {
    newBottom = Math.min(Math.max(newBottom, props.minHeightBottom), totalHeight.value - props.minHeightTop)
    newTop = totalHeight.value - newBottom
  }
  heightTop.value = newTop
  heightBottom.value = newBottom

  emit('windowChange', {
    widthTop: Math.round(widthTop.value),
    heightTop: Math.round(heightTop.value),
    widthBottom: Math.round(widthBottom.value),
    heightBottom: Math.round(heightBottom.value),
  })
}

function onTopResize({dx, dy}: { dx: number; dy: number }) {
  widthTop.value = Math.min(Math.max(props.minWidthTop, widthTop.value - dx), props.maxWidthTop)
  applyHeightDelta('top', dy)
}

function onBottomResize({dx, dy}: { dx: number; dy: number }) {
  widthBottom.value = Math.min(Math.max(props.minWidthBottom, widthBottom.value - dx), props.maxWidthBottom)
  const resultY = props.isJokeOpen ? -dy : dy
  applyHeightDelta('bottom', resultY)
}
</script>
<template>
  <div ref="containerRef" class="windows-column">
    <slot name="top" :height="heightTop" :width="widthTop" :onResize="onTopResize"/>
    <slot name="bottom" :height="heightBottom" :width="widthBottom" :onResize="onBottomResize"/>
  </div>
</template>
<style scoped>
.windows-column {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  overflow: hidden;
  pointer-events: none;
  background-color: transparent;
  gap: 8px;
}

.windows-column > * {
  pointer-events: auto; /* чтобы дочерние элементы оставались кликабельными */
}
</style>