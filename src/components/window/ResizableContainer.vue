<script setup lang="ts">
defineProps<{
  currentWidth: number
}>()
const emit = defineEmits<{
  resize: [{ dx: number; dy: number }]
}>()
let startX = 0
let startY = 0
function startResize(e: MouseEvent) {
  e.preventDefault()
  startX = e.clientX
  startY = e.clientY
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}
function onMove(e: MouseEvent) {
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  startX = e.clientX
  startY = e.clientY
  emit('resize', {dx, dy})
}
function onUp() {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onUp)
}
</script>
<template>
  <div class="box" :style="{ width: currentWidth + 'px' }">
    <slot/>
    <div class="resize-handle" @mousedown="startResize"/>
  </div>
</template>
<style scoped>
.box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;
  width: 100%;
}
.resize-handle {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 24px;
  height: 24px;
  cursor: grab;
  background: linear-gradient(
      45deg,
      transparent 0% 8%,
      white 8% 12%,
      black 12% 16%,
      transparent 16% 20%,
      white 20% 24%,
      black 24% 28%,
      transparent 28% 32%,
      white 32% 36%,
      black 36% 40%,
      transparent 40% 44%,
      white 44% 48%,
      black 48% 52%,
      transparent 52% 100%
  );
}
</style>