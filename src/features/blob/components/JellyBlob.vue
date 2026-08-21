<script setup>
import {computed, ref, watch} from 'vue'
import {useJellyBlob} from "@/features/blob/composables/useJellyBlob.js";

const props = defineProps({
  isAuth: {type: Boolean, required: true},

  areaWidth: {type: Number, default: 100},
  areaHeight: {type: Number, default: 100},

  pointCount: {type: Number, default: 10},
  restRadius: {type: Number, default: 70},

  gravity: {type: Number, default: 900},
  shapeStiffness: {type: Number, default: 0.135},
  edgeStiffness: {type: Number, default: 0.7},
  wallBounce: {type: Number, default: 0.7},
  mouseStiffness: {type: Number, default: 0.95},

  rotationScoreRate: {type: Number, default: 0.0005},
  dragScoreRate: {type: Number, default: 0.0005},
  throwDragScoreRate: {type: Number, default: 0.0002},
  throwRotationScoreRate: {type: Number, default: 0.001},
  throwMaxDuration: {type: Number, default: 1},

  throwMinSpeed: {type: Number, default: 30},

  colorStops: {
    type: Array,
    default: () => [
      [0, '#d9f3a3'],
      [0.45, '#8fcf4b'],
      [1, '#3f8f2a'],
    ],
  },
})

const emit = defineEmits(['grab', 'release', 'throw', 'score'])

const canvasEl = ref(null)

const {
  isLoading,
  score,
  getScore,
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
  <div class="jelly-blob">
    <canvas
        ref="canvasEl"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointerleave="onPointerUp"
        @pointercancel="onPointerUp"
    />
    <div v-if="isAuth && !isLoading" class="jelly-score">Очки: {{ scoreRound }}</div>
  </div>
</template>

<style scoped>
.jelly-blob {
  display: flex;
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