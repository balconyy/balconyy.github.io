<script setup>
import {ref, onBeforeUnmount} from 'vue'

const {defaultHeight} = defineProps({
  defaultHeight: {
    type: Number,
    required: true
  }
})


const MIN_SIZE = 250
const height = ref(defaultHeight)


let startY = 0
let startH = 0

function startResize(e) {
  e.preventDefault()

  startY = e.clientY
  startH = height.value

  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stop)
}

function resize(e) {
  const dy = e.clientY - startY

  height.value = Math.max(MIN_SIZE, startH + dy)
}

function stop() {
  window.removeEventListener('mousemove', resize)
  window.removeEventListener('mouseup', stop)
}

onBeforeUnmount(stop)
</script>

<template>
  <div class="wrapper">
    <div class="box" :style="{ height: height + 'px' }">
      <slot/>
      <div class="resize-handle" @mousedown="startResize"/>
    </div>
  </div>
</template>


<style scoped>
.wrapper {
  display: flex;
}

.box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-handle {
  position: absolute;
  left: 0;
  bottom: 0;

  width: 20px;
  height: 20px;


  cursor: pointer;
  background-size: auto;
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