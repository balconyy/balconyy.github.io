<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {BlobCaseInfoDto} from "@/data/dto/blobCaseInfoDto";
import rouletteIcon from "@/assets/icons/roulette-icon.png";
import BaseWindow from "@/components/window/BaseWindow.vue";
import caseClickSoundSrc from "@/assets/sound/case-click.mp3";
import caseEndSoundSrc from "@/assets/sound/case-end.ogg";
import WindowLoading from "@/components/window/WindowLoading.vue";

const props = defineProps<{
  availableSkins: BlobCaseInfoDto[]
  winner: BlobCaseInfoDto,
  isEquipLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'equip'): void
  (e: 'claim'): void
}>()

const RARITY_LABEL: Record<string, string> = {
  UNCOMMON: 'Необычный',
  RARE: 'Редкий',
  EPIC: 'Эпический',
  LEGENDARY: 'Легендарный',
}

const RARITY_HEX: Record<string, string> = {
  UNCOMMON: '#1155dd',
  RARE: '#884dff',
  EPIC: '#eb4b4b',
  LEGENDARY: '#caab05',
}

function rarityKey(skin: BlobCaseInfoDto): string {
  return String(skin.rarity).toUpperCase()
}

function rarityClass(skin: BlobCaseInfoDto): string {
  return `rarity-${rarityKey(skin).toLowerCase()}`
}

function rarityLabel(skin: BlobCaseInfoDto): string {
  return RARITY_LABEL[rarityKey(skin)] ?? String(skin.rarity)
}

function rarityHex(skin: BlobCaseInfoDto): string {
  return RARITY_HEX[rarityKey(skin)] ?? '#3a3c42'
}

const ITEM_WIDTH = 112 // px — ширина карточки скина, должна совпадать с CSS
const ITEM_GAP = 10 // px — зазор между карточками, должен совпадать с CSS
const ITEM_FULL = ITEM_WIDTH + ITEM_GAP

const LAPS_BEFORE_WIN = 6 // сколько полных прогонов перемешанного списка прокрутится до победителя
const TRAIL_LAPS = 1 // ещё один прогон "про запас", чтобы после остановки справа от указателя тоже были карточки
const TOTAL_LAPS = LAPS_BEFORE_WIN + TRAIL_LAPS
const TARGET_LAP = LAPS_BEFORE_WIN - 1 // прогон (0-индекс), на котором остановится лента

function shuffle<T>(source: T[]): T[] {
  const copy = [...source]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}


const shuffledSkins = computed(() => {
  const base = shuffle(props.availableSkins)
  if (!base.some((skin) => skin.id === props.winner.id)) {
    base.push(props.winner) // страховка на случай, если winner не входит в availableSkins
  }
  return base
})

const winnerLocalIndex = computed(() =>
    Math.max(
        0,
        shuffledSkins.value.findIndex((skin) => skin.id === props.winner.id)
    )
)

interface ReelEntry {
  key: string
  skin: BlobCaseInfoDto
  isTarget: boolean
}

const reelItems = computed<ReelEntry[]>(() => {
  const list = shuffledSkins.value
  const entries: ReelEntry[] = []
  for (let lap = 0; lap < TOTAL_LAPS; lap++) {
    list.forEach((skin, i) => {
      entries.push({
        key: `${skin.id}-${lap}-${i}`,
        skin,
        isTarget: lap === TARGET_LAP && i === winnerLocalIndex.value,
      })
    })
  }
  return entries
})

const targetGlobalIndex = computed(
    () => TARGET_LAP * shuffledSkins.value.length + winnerLocalIndex.value
)

const viewportRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const trackOffset = ref(0)
const phase = ref<'spinning' | 'result'>('spinning')
const hasLanded = ref(false)

// --- Звуки ---

const caseClickAudio = new Audio(caseClickSoundSrc)
caseClickAudio.preload = 'auto'
caseClickAudio.volume = 0.4

const caseEndAudio = new Audio(caseEndSoundSrc)
caseEndAudio.preload = 'auto'
caseEndAudio.volume = 0.4

function playClickSound() {
  // клонируем узел, чтобы быстрые повторные щелчки не обрывали друг друга
  const node = caseClickAudio.cloneNode(true) as HTMLAudioElement
  node.volume = caseClickAudio.volume
  node.play().catch(() => {})
}

let endSoundPlayed = false

function playEndSound() {
  if (endSoundPlayed) return
  endSoundPlayed = true
  caseEndAudio.currentTime = 0
  caseEndAudio.play().catch(() => {})
}

// --- Тиканье ленты: следим за реальным transform во время CSS-анимации
// и проигрываем щелчок каждый раз, когда под указателем оказывается новая карточка ---

let tickRafId: number | undefined
let lastTickIndex: number | null = null

function readCurrentTranslateX(): number | null {
  const track = trackRef.value
  if (!track) return null
  const transform = window.getComputedStyle(track).transform
  if (!transform || transform === 'none') return 0
  const matrix = new DOMMatrixReadOnly(transform)
  return matrix.m41
}

function trackTickLoop() {
  const viewport = viewportRef.value
  const tx = readCurrentTranslateX()

  if (viewport && tx !== null) {
    const viewportCenter = viewport.clientWidth / 2
    const idx = Math.round((viewportCenter - tx - ITEM_WIDTH / 2) / ITEM_FULL)

    if (lastTickIndex === null) {
      lastTickIndex = idx
    } else if (idx !== lastTickIndex) {
      lastTickIndex = idx
      playClickSound()
    }
  }

  if (phase.value === 'spinning' && !hasLanded.value) {
    tickRafId = requestAnimationFrame(trackTickLoop)
  }
}

function startTickLoop() {
  stopTickLoop()
  lastTickIndex = null
  tickRafId = requestAnimationFrame(trackTickLoop)
}

function stopTickLoop() {
  if (tickRafId !== undefined) {
    window.cancelAnimationFrame(tickRafId)
    tickRafId = undefined
  }
}

function startSpin() {
  const viewport = viewportRef.value
  if (!viewport) return

  const viewportCenter = viewport.clientWidth / 2
  const itemCenter = targetGlobalIndex.value * ITEM_FULL + ITEM_WIDTH / 2

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const jitter = prefersReducedMotion ? 0 : (Math.random() - 0.5) * (ITEM_WIDTH * 0.5)

  const offset = viewportCenter - itemCenter - jitter

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      trackOffset.value = offset
      startTickLoop()
    })
  })
}

function onTrackTransitionEnd(event: TransitionEvent) {
  if (event.propertyName !== 'transform') return
  hasLanded.value = true
  stopTickLoop()
  window.setTimeout(() => {
    playEndSound()
    phase.value = 'result'
  }, 650)
}

let fallbackTimer: number | undefined

onMounted(() => {
  startSpin()
  fallbackTimer = window.setTimeout(() => {
    if (phase.value === 'spinning') {
      hasLanded.value = true
      stopTickLoop()
      playEndSound()
      phase.value = 'result'
    }
  }, 8500)
})

onBeforeUnmount(() => {
  if (fallbackTimer) window.clearTimeout(fallbackTimer)
  stopTickLoop()
})

function handleEquip() {
  emit('equip')
}

function handleClaim() {
  emit('claim')
}

</script>

<template>
  <Teleport to="body">
    <div class="roulette-overlay" role="dialog" aria-modal="true">
      <BaseWindow
          title="Рулетка"
          headerColorHex="#0B4D3B"
          :headerIcon="rouletteIcon"
          :isOpen="true"
          :buttonEnabled="false"
          @toggleWindow="$emit('toggleWindow')">
        <div class="roulette-panel">
          <div v-if="phase === 'spinning'" ref="viewportRef" class="reel-viewport">
            <div class="reel-pointer-line"></div>
            <div class="reel-caret reel-caret--top"></div>
            <div class="reel-caret reel-caret--bottom"></div>

            <div
                ref="trackRef"
                class="reel-track"
                :style="{ transform: `translateX(${trackOffset}px)` }"
                @transitionend="onTrackTransitionEnd"
            >
              <div
                  v-for="item in reelItems"
                  :key="item.key"
                  class="reel-item"
                  :style="{ '--rarity-color': rarityHex(item.skin) }"
              >
                <img class="reel-item-image" :src="item.skin.image" :alt="item.skin.name"/>
                <span class="reel-item-name" :class="rarityClass(item.skin)">{{ item.skin.name }}</span>
              </div>
            </div>

            <div class="reel-fade reel-fade--left"></div>
            <div class="reel-fade reel-fade--right"></div>
          </div>

          <Transition name="reveal">
            <div v-if="phase === 'result'" class="winner-card">
              <div class="winner-image-frame" :style="{ '--rarity-color': rarityHex(winner) }">
                <img class="winner-image" :src="winner.image" :alt="winner.name"/>
              </div>
              <span class="winner-name">{{ winner.name }}</span>
              <span class="winner-rarity" :class="rarityClass(winner)">{{ rarityLabel(winner) }}</span>
              <p v-if="winner.quote" class="winner-quote">«{{ winner.quote }}»</p>

              <div class="winner-actions">
                <button v-if="!isEquipLoading" class="case-button" type="button" @click="handleEquip">Экипировать</button>
                <WindowLoading v-else/>
                <button class="case-button" type="button" @click="handleClaim">Принять</button>
              </div>
            </div>
          </Transition>
        </div>
      </BaseWindow>
    </div>
  </Teleport>
</template>

<style scoped>
.roulette-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.78);
  z-index: 1000;
  animation: overlay-fade 0.18s ease;
}

@keyframes overlay-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.roulette-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 640px;
  padding: 22px 20px 26px;
  box-sizing: border-box;
  background: #1f1f1f;
  color: #dcddde;
  font-family: 'JetBrains Mono', 'Consolas', 'Courier New', monospace;
  border-top: 2px solid #2a2a2a;
  border-left: 2px solid #2a2a2a;
  border-right: 2px solid #4a4a4a;
  border-bottom: 2px solid #4a4a4a;
  box-shadow: 0 14px 44px rgba(0, 0, 0, 0.6);
}

.close-button {
  position: absolute;
  top: 6px;
  right: 10px;
  background: none;
  border: none;
  color: #9a9b9e;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
}

.close-button:hover {
  color: #f2f2f2;
}


.reel-viewport {
  position: relative;
  width: 100%;
  max-width: 580px;
  height: 150px;
  overflow: hidden;
  background: #161616;
  border: 1px solid #3a3c42;
}

.reel-pointer-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: #f5da8c;
  box-shadow: 0 0 8px rgba(245, 218, 140, 0.7);
  z-index: 3;
}

.reel-caret {
  position: absolute;
  left: 50%;
  width: 0;
  height: 0;
  transform: translateX(-50%);
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  z-index: 4;
}

.reel-caret--top {
  top: 0;
  border-top: 9px solid #f5da8c;
}

.reel-caret--bottom {
  bottom: 0;
  border-bottom: 9px solid #f5da8c;
}

.reel-track {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
  transition: transform 6.4s cubic-bezier(0.12, 0.79, 0.32, 1);
  will-change: transform;
}

.reel-item {
  --rarity-color: #3a3c42;
  flex: 0 0 auto;
  width: 112px;
  height: 126px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 4px;
  background: #1f1f1f;
  border: 1px solid #3a3c42;
  border-bottom: 3px solid var(--rarity-color);
  transition: box-shadow 0.2s, transform 0.2s;
}

.reel-item-image {
  width: 62px;
  height: 62px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  border-radius: 50%;
}

.reel-item-name {
  font-size: 10px;
  font-weight: 700;
  line-height: 1.25;
  max-width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reel-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 56px;
  pointer-events: none;
  z-index: 2;
}

.reel-fade--left {
  left: 0;
  background: linear-gradient(90deg, #161616, transparent);
}

.reel-fade--right {
  right: 0;
  background: linear-gradient(270deg, #161616, transparent);
}

.reveal-enter-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.reveal-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}

.winner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 2px;
}

.winner-image-frame {
  --rarity-color: #3a3c42;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #161616;
  border: 2px solid var(--rarity-color);
  box-shadow: 0 0 22px 2px var(--rarity-color);
  border-radius: 50%;
}

.winner-image {
  border-radius: 50%;
  width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
}

.winner-name {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}

.winner-rarity {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  opacity: 0.9;
}

.winner-quote {
  max-width: 420px;
  margin: 0;
  font-size: 12px;
  font-style: italic;
  color: #9a9b9e;
  text-align: center;
  line-height: 1.55;
}

.winner-actions {
  display: flex;
  gap: 14px;
  margin-top: 8px;
}

/* --- Редкость: цвета текста, как в остальном проекте --- */

.rarity-uncommon {
  color: #1155dd;
}

.rarity-rare {
  color: #884dff;
}

.rarity-epic {
  color: #eb4b4b;
}

.rarity-legendary {
  color: #caab05;
}

/* --- Кнопки: 1 в 1 стиль из case-container --- */

.case-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 8px 20px;

  background: #3a3a3a;
  color: #f2f2f2;

  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 15px;
  font-weight: 700;

  border: 2px solid;
  border-color: #707070 #101010 #101010 #707070;
  cursor: pointer;
  user-select: none;

  transition: background .08s;
}


.case-button:hover {
  background: #383838;
}

.case-button:active {
  background: #252525;
  border-color: #101010 #606060 #606060 #101010;
  transform: translate(1px, 1px);
}


</style>