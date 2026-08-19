<script setup>
import {computed, onBeforeUnmount, onMounted, ref,} from 'vue'

const props = defineProps({
  areaWidth: {
    type: Number,
    default: 100,
  },
  areaHeight: {
    type: Number,
    default: 100,
  },
})

const canvasEl = ref(null)

const gravity = ref(900)
const shapeStiffness = ref(0.15)
const edgeStiffness = ref(0.8)
const wallBounce = ref(0.7)
const mouseStiffness = ref(0.9)

const pointCount = ref(12)

const REST_R = 70
const SUBSTEPS = 4
const DAMPING = 0.988
const WALL_MARGIN = 2

const restCenter = computed(() => ({
  x: props.areaWidth / 2,
  y: props.areaHeight / 2,
}))

let points = []
let restEdgeLen = 0
let ctx = null
let raf = null
let lastT = 0

const pointer = {
  active: false,
  x: 0,
  y: 0,
  grabbed: -1,
}

/**
 * Создание исходной формы.
 */
function buildBlob() {
  const n = Math.max(4, Math.round(pointCount.value))

  const center = restCenter.value

  points = []

  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2

    const ox = Math.cos(angle) * REST_R
    const oy = Math.sin(angle) * REST_R

    points.push({
      x: center.x + ox,
      y: center.y + oy,
      vx: 0,
      vy: 0,
      ox,
      oy,
      grabbed: false,
    })
  }

  const angleStep = (Math.PI * 2) / n

  restEdgeLen =
      2 * REST_R * Math.sin(angleStep / 2)

  pointer.grabbed = -1
  pointer.active = false
}

/**
 * Пружина между двумя соседними точками.
 */
function solveEdge(a, b, rest, stiffness) {
  const dx = b.x - a.x
  const dy = b.y - a.y

  const dist = Math.hypot(dx, dy) || 0.0001
  const diff = (dist - rest) / dist

  const cx = dx * 0.5 * diff * stiffness
  const cy = dy * 0.5 * diff * stiffness

  if (!a.grabbed) {
    a.x += cx
    a.y += cy
  }

  if (!b.grabbed) {
    b.x -= cx
    b.y -= cy
  }
}

/**
 * Возвращает точки к исходной окружности,
 * сохраняя возможность поворота формы.
 */
function shapeMatch() {
  if (!points.length) {
    return
  }

  let cx = 0
  let cy = 0

  for (const p of points) {
    cx += p.x
    cy += p.y
  }

  cx /= points.length
  cy /= points.length

  let A = 0
  let B = 0

  for (const p of points) {
    const px = p.x - cx
    const py = p.y - cy

    A += px * p.ox + py * p.oy
    B += py * p.ox - px * p.oy
  }

  const angle = Math.atan2(B, A)

  const c = Math.cos(angle)
  const s = Math.sin(angle)

  const stiffness = shapeStiffness.value

  for (const p of points) {
    if (p.grabbed) {
      continue
    }

    const gx =
        cx + (p.ox * c - p.oy * s)

    const gy =
        cy + (p.ox * s + p.oy * c)

    p.x += (gx - p.x) * stiffness
    p.y += (gy - p.y) * stiffness
  }
}

/**
 * Ограничение точки стенами.
 */
function solveWalls() {
  const maxX = props.areaWidth - WALL_MARGIN
  const maxY = props.areaHeight - WALL_MARGIN
  const bounce = wallBounce.value

  for (const p of points) {
    if (p.x < WALL_MARGIN) {
      p.x = WALL_MARGIN
      p.vx *= -bounce
    }

    if (p.x > maxX) {
      p.x = maxX
      p.vx *= -bounce
    }

    if (p.y < WALL_MARGIN) {
      p.y = WALL_MARGIN
      p.vy *= -bounce
    }

    if (p.y > maxY) {
      p.y = maxY
      p.vy *= -bounce
    }
  }
}

/**
 * Перетаскивание мышью / touch / pointer.
 */
function solvePointer(dt) {
  if (
      !pointer.active ||
      pointer.grabbed < 0
  ) {
    return
  }

  const p = points[pointer.grabbed]

  if (!p) {
    return
  }

  const dx = pointer.x - p.x
  const dy = pointer.y - p.y

  const stiffness = mouseStiffness.value

  p.x += dx * stiffness
  p.y += dy * stiffness

  p.vx = (dx * stiffness) / dt
  p.vy = (dy * stiffness) / dt
}

/**
 * Один физический подшаг.
 */
function substep(dt) {
  const currentGravity = gravity.value

  // Гравитация + демпфирование + движение
  for (const p of points) {
    if (p.grabbed) {
      continue
    }

    p.vy += currentGravity * dt

    p.vx *= DAMPING
    p.vy *= DAMPING

    p.x += p.vx * dt
    p.y += p.vy * dt
  }

  // Перетаскивание
  solvePointer(dt)

  // Пружины периметра
  const stiffness = edgeStiffness.value

  for (let i = 0; i < points.length; i++) {
    solveEdge(
        points[i],
        points[(i + 1) % points.length],
        restEdgeLen,
        stiffness,
    )
  }

  // Возврат к исходной форме
  shapeMatch()

  // Столкновение со стенами
  solveWalls()
}

function step(dt) {
  const sdt = dt / SUBSTEPS

  for (let i = 0; i < SUBSTEPS; i++) {
    substep(sdt)
  }
}

function midpoint(a, b) {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  }
}

/**
 * Отрисовка blob.
 */
function draw() {
  if (!ctx || !points.length) {
    return
  }

  const width = props.areaWidth
  const height = props.areaHeight

  ctx.clearRect(0, 0, width, height)

  const n = points.length

  ctx.beginPath()

  const firstMidpoint = midpoint(
      points[n - 1],
      points[0],
  )

  ctx.moveTo(
      firstMidpoint.x,
      firstMidpoint.y,
  )

  for (let i = 0; i < n; i++) {
    const current = points[i]
    const next = points[(i + 1) % n]

    const mid = midpoint(current, next)

    ctx.quadraticCurveTo(
        current.x,
        current.y,
        mid.x,
        mid.y,
    )
  }

  ctx.closePath()

  // Центр blob
  let cx = 0
  let cy = 0

  for (const p of points) {
    cx += p.x
    cy += p.y
  }

  cx /= n
  cy /= n

  // Градиент
  const gradient =
      ctx.createRadialGradient(
          cx - 30,
          cy - 40,
          10,
          cx,
          cy,
          REST_R * 1.6,
      )

  gradient.addColorStop(0, '#d9f3a3')
  gradient.addColorStop(0.45, '#8fcf4b')
  gradient.addColorStop(1, '#3f8f2a')

  ctx.fillStyle = gradient
  ctx.fill()

  ctx.lineWidth = 1

  ctx.strokeStyle =
      'rgba(255,255,255,0.5)'

  ctx.stroke()

  // Точка захвата
  if (
      pointer.active &&
      pointer.grabbed >= 0
  ) {
    const p = points[pointer.grabbed]

    if (!p) {
      return
    }

    ctx.beginPath()

    ctx.arc(
        p.x,
        p.y,
        5,
        0,
        Math.PI * 2,
    )

    ctx.fillStyle =
        'rgba(255,244,214,0)'

    ctx.fill()
  }
}

function loop(t) {
  if (!lastT) {
    lastT = t
  }

  let dt = (t - lastT) / 1000

  lastT = t

  // Защита от скачков времени
  dt = Math.min(dt, 1 / 30)

  step(dt)
  draw()

  raf = requestAnimationFrame(loop)
}

/**
 * Координаты указателя относительно canvas.
 */
function canvasPos(e) {
  const canvas = canvasEl.value

  if (!canvas) {
    return {
      x: 0,
      y: 0,
    }
  }

  const rect = canvas.getBoundingClientRect()

  return {
    x:
        (e.clientX - rect.left) *
        (props.areaWidth / rect.width),

    y:
        (e.clientY - rect.top) *
        (props.areaHeight / rect.height),
  }
}

function onDown(e) {
  const canvas = canvasEl.value

  if (!canvas) {
    return
  }

  const pos = canvasPos(e)

  let index = -1
  let bestDistance = Infinity

  points.forEach((p, i) => {
    const distance = Math.hypot(
        p.x - pos.x,
        p.y - pos.y,
    )

    if (distance < bestDistance) {
      bestDistance = distance
      index = i
    }
  })

  if (index >= 0 && bestDistance < 46) {
    points[index].grabbed = true

    pointer.grabbed = index
    pointer.active = true

    pointer.x = pos.x
    pointer.y = pos.y

    canvas.setPointerCapture(e.pointerId)
  }
}

function onMove(e) {
  if (!pointer.active) {
    return
  }

  const pos = canvasPos(e)

  pointer.x = pos.x
  pointer.y = pos.y
}

function onUp(e) {
  if (pointer.grabbed >= 0) {
    const p = points[pointer.grabbed]

    if (p) {
      p.grabbed = false
    }
  }

  pointer.grabbed = -1
  pointer.active = false

  const canvas = canvasEl.value

  if (
      canvas &&
      e?.pointerId != null &&
      canvas.hasPointerCapture(e.pointerId)
  ) {
    canvas.releasePointerCapture(e.pointerId)
  }
}

function resetPhysics() {
  pointer.grabbed = -1
  pointer.active = false

  buildBlob()

  lastT = performance.now()

  draw()
}

/**
 * Инициализация canvas.
 */
function initCanvas() {
  const canvas = canvasEl.value

  if (!canvas) {
    return
  }

  ctx = canvas.getContext('2d')

  resetPhysics()
}


onMounted(() => {
  initCanvas()

  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  if (raf) {
    cancelAnimationFrame(raf)
    raf = null
  }

  pointer.grabbed = -1
  pointer.active = false

  ctx = null
})
</script>

<template>
  <div class="jelly-blob">
    <canvas
        ref="canvasEl"
        :width="props.areaWidth"
        :height="props.areaHeight"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointerleave="onUp"
        @pointercancel="onUp"
    />
  </div>
</template>

<style scoped>
.jelly-blob {
  display: flex;
}


canvas {
  display: block;

  touch-action: none;
  cursor: grab;
}

canvas:active {
  cursor: grabbing;
}


</style>