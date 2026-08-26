<script setup>
import {computed, ref, watch} from 'vue'
import {useJellyBlob} from "@/features/blob/composables/useJellyBlob.js";
import WindowLoading from "@/components/window/WindowLoading.vue";

const props = defineProps({
  isAuth: {type: Boolean},

  areaWidth: {type: Number, default: 100},
  areaHeight: {type: Number, default: 100},

  radius: {type: Number, default: 70},

})

const emit = defineEmits(['grab', 'release', 'throw', 'score'])

const canvasEl = ref(null)

const {
  isLoading,
  score,
  getScore,
  endLoading,
  saveScore,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  reset,
} = useJellyBlob(canvasEl, props, emit)

const scoreRound = computed(() => score.value.toFixed(1))

watch(
    () => props.isAuth,
    (newVal) => {
      if (newVal) {
        getScore()
      } else if (newVal !== null) {
        endLoading()
      }
    },
    {immediate: true}
)


function saveScoreBefore() {
  return saveScore(score.value)
}


defineExpose({reset, score, saveScoreBefore})

</script>

<template>
  <WindowLoading v-if="isLoading"/>
  <div v-show="!isLoading" class="jelly-blob-wrapper">
    <div class="jelly-blob">
      <canvas
          ref="canvasEl"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
          @pointercancel="onPointerUp"
      />
      <div v-if="isAuth" class="jelly-score">Очки: {{ scoreRound }}</div>
    </div>
  </div>
</template>

<style scoped>
.jelly-blob {
  display: flex;
}

.jelly-blob-wrapper {
  background-color: #1f1f1f;
  padding: 0 2px 2px 2px;
  border-left: 2px solid #2a2a2a;
  border-right: 2px solid #4a4a4a;
  border-bottom: 2px solid #4a4a4a;
}

.jelly-score {
  position: absolute;
  right: 12px;
  padding: 4px 9px;
  border-left: 1px solid #3d3d3d;
  border-bottom: 1px solid #3d3d3d;
  border-radius: 3px;

  color: #d8d8d8;
  font-family: Tahoma, Arial, sans-serif;
  font-size: 14px;
  line-height: 18px;

  user-select: none;
}

canvas {
  touch-action: none;
}
</style>