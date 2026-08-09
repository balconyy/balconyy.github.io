<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {Info, SquareArrowOutUpRight, X} from "@lucide/vue";
import Omega from '@/assets/icons/omega-icon.svg'
import {useTiming} from "@/features/player/composables/useTiming";
import WindowLoading from "@/components/window/WindowLoading.vue";
import {useUserAuth} from "@/features/auth/composables/useUserAuth";

const props = defineProps<{
  kpId: number;
}>();

const isOpen = ref(false);
const isClicked = ref(false);
const newTiming = ref("");

const {
  timings,
  isLoading,
  error,
  getTimings,
  addTiming,
  deleteTiming,
} = useTiming();

function toggleWindow() {
  isOpen.value = !isOpen.value;
  isClicked.value = true;
}

function sendTiming() {
  const text = newTiming.value.trim();
  if (!text) return;
  addTiming(props.kpId, text);
  newTiming.value = "";
}

const userAuth = useUserAuth();
const isNotAuth = computed(() => userAuth.user.value == null);

onMounted(() => {
  getTimings(props.kpId)
})

</script>

<template>
  <div ref="root" class="timing-wrapper">
    <button
        class="timing-button"
        :class="{ attention: timings.length && !isClicked }"
        @click="toggleWindow"
    >
      <Omega/>
    </button>

    <div v-show="isOpen" class="timing-screen">
      <div class="timing-list">
        <WindowLoading v-if="isLoading"/>

        <div v-else
             v-for="timing in timings"
             :key="timing.id"
             class="timing-card"
        >
          <button
              v-if="timing.isOwner"
              class="timing-card-delete"
              :disabled="isLoading"
              @click="deleteTiming(timing.id, kpId)"
          >
            <X color="#f1f"/>
          </button>
          <div class="timing-nickname" :style="{ color: timing.nameColor }">
            {{ timing.nickname }}
          </div>
          <div class="timing-text">{{ timing.timingText }}</div>
        </div>
      </div>

      <div v-if="isNotAuth" class="auth-placeholder">
        Авторизируйтесь, для отправки таймингов
      </div>

      <div v-else class="timing-form">
        <textarea
            v-model="newTiming"
            class="timing-input"
            placeholder="Введите свои тайминги..."
            rows="3"
            :disabled="isLoading"
            @keydown.enter.exact.prevent="sendTiming"
        />
        <div class="timing-form-actions">
          <div class="hint-wrapper">
            <Info class="hint-icon"/>
            <div class="timing-hint">
              Сначала вводите общую длительность в [ ], затем сами моменты через -.<br>
              Для сериалов указывайте сезон и номер эпизода.<br><br>
              Пример:<br>
              <div class="hint-example">
                [1:50:24]<br>
                45:53 - 46:07 мужская жопа
              </div>
            </div>
          </div>
          <button
              class="timing-submit"
              :disabled="!newTiming.trim() || isLoading"
              @click="sendTiming"
          >
            Отправить
          </button>
        </div>
      </div>

      <a
          href="https://chromewebstore.google.com/detail/ratecommunity-extension/fmhbfijcjgghlidigfecneahakjoiahm"
          target="_blank"
          rel="noopener noreferrer"
          class="timing-extention"
      >
        Расширение для Автоблюра
        <SquareArrowOutUpRight class="link-icon"/>
      </a>
    </div>
  </div>
</template>

<style scoped>

.timing-screen {
  position: absolute;
  top: 42px;
  left: 0;
  width: 400px;
  max-height: 600px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.95);
  z-index: 10;
}

.timing-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
  scrollbar-color: rgba(var(--accent-dark-rgb)/0.4) transparent;
}

.timing-list::-webkit-scrollbar {
  width: 8px;
}

.timing-list::-webkit-scrollbar-track {
  background: #111;
}

.timing-list::-webkit-scrollbar-thumb {
  background: var(--accent-dark);
}

.timing-card {
  position: relative;
  padding: 8px;
  border: 1px solid rgba(var(--accent-color-rgb)/ 0.15);
  background: rgba(var(--accent-color-rgb)/0.2);
  margin-bottom: 8px;
}

.timing-card:last-child {
  margin-bottom: 0;
}

.timing-card-delete {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 10;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(var(--accent-dark-rgb) / 0.25);
  border-radius: 50%;
  background: rgba(var(--accent-color-rgb) / 0.15);
  color: rgba(var(--accent-color-rgb) / 0.9);

  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease,
  background 0.2s ease,
  border-color 0.2s ease,
  color 0.2s ease
}

.timing-card:hover .timing-card-delete {
  opacity: 1;
}

.timing-nickname {
  margin-bottom: 6px;
  color: var(--accent-color);
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.timing-text {
  color: #b8b8b8;
  font-size: 12px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.timing-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.timing-input {
  resize: none;
  width: 100%;
  padding: 8px;
  border: 1px solid rgba(var(--accent-color-rgb) / 0.3);
  background: rgba(var(--accent-color-rgb) / 0.1);
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  line-height: 1.45;
  font-family: inherit;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.timing-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}

.timing-input:focus {
  outline: none;
  border-color: rgba(var(--accent-color-rgb) / 0.6);
  background: rgba(var(--accent-color-rgb) / 0.15);
}

.timing-form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.timing-submit {
  flex-shrink: 0;
  padding: 8px 16px;
  border: 1px solid rgba(var(--accent-color-rgb) / 0.3);
  background: rgba(var(--accent-color-rgb) / 0.4);
  color: var(--accent-light);
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease;
}

.timing-submit:hover:not(:disabled) {
  background: rgba(var(--accent-color-rgb) / 0.45);
  border-color: rgba(var(--accent-color-rgb) / 0.5);
}

.timing-submit:active:not(:disabled) {
  background: rgba(var(--accent-color-rgb) / 0.55);
}

.timing-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.hint-wrapper {
  position: relative;
  flex-shrink: 0;
}

.hint-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  color: rgba(var(--accent-light-rgb)/0.5);
  transition: color 0.15s ease;
}

.hint-wrapper:hover .hint-icon {
  color: var(--accent-light);
}

.timing-hint {
  position: absolute;
  bottom: calc(100%);
  right: 0;
  width: 250px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.95);
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  line-height: 1.2;
  border-radius: 8px;
  text-align: justify;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s ease;
  pointer-events: none;
  z-index: 11;
}

.hint-wrapper:hover .timing-hint {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}


.hint-example {
  margin-top: 6px;
  padding: 4px;
  font-family: monospace;
  color: var(--accent-light);
  font-size: 12px;
  line-height: 1.6;
  border-radius: 8px;
  background: rgba(var(--accent-light-rgb)/ 0.15);;
}

.auth-placeholder {
  padding: 10px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
}

.timing-extention {
  display: flex;
  width: fit-content;
  margin: 4px auto 12px auto;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: 1px solid rgba(var(--accent-color-rgb) / 0.3);
  background: rgba(var(--accent-color-rgb) / 0.4);
  color: var(--accent-light);
  font-weight: bold;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  border-radius: 8px;
}

.timing-extention:hover {
  background: rgba(var(--accent-color-rgb) / 0.45);
  border-color: rgba(var(--accent-color-rgb) / 0.5);
}

.timing-extention:active {
  background: rgba(var(--accent-color-rgb) / 0.55);
}

.link-icon {
  width: 12px;
  height: 12px;
  margin: 4px;
  flex-shrink: 0;
  color: var(--accent-light);
}

.timing-button {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  background: rgba(128, 128, 128, 0.1);
  font-family: monospace;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0;
}

.timing-button.attention {
  border: 1px solid #ff3300;
  color: #ff3300;
  animation: attention-pulse 1.5s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(255, 51, 0, 0.5);
}

@keyframes attention-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 5px rgba(255, 51, 0, 0.5);
    border-color: #ff3300;
  }
  50% {
    transform: scale(1.04);
    box-shadow: 0 0 25px rgba(255, 51, 0, 0.9);
    border-color: #ff6600;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 5px rgba(255, 51, 0, 0.5);
    border-color: #ff3300;
  }
}
</style>