<script setup lang="ts">
import {ref} from 'vue'
import {Loader2} from '@lucide/vue'

type PromoStatus = 'idle' | 'applied' | 'error'

const props = defineProps<{
  isLoading?: boolean
  status?: PromoStatus
  message?: string
}>()

const emit = defineEmits<{
  (e: 'apply', code: string): void
}>()

const code = ref('')

function submit(): void {
  const trimmed = code.value.trim()
  if (!trimmed || props.isLoading) return
  emit('apply', trimmed)
}
</script>

<template>
  <div class="customization-promo">
    <div class="promo-body">
      <div class="promo-row">
        <input
            v-model="code"
            class="promo-input"
            type="text"
            placeholder="Введите промокод"
            :disabled="isLoading"
            @keyup.enter="submit"
        />
        <button
            class="promo-btn"
            :disabled="isLoading || !code.trim()"
            @click="submit"
        >
          <Loader2 v-if="isLoading" class="promo-spin" :size="14" stroke-width="2.6"/>
          <span v-else>Применить</span>
        </button>
      </div>

      <div v-if="status === 'applied'" class="promo-status promo-status--ok">
        <span>Промокод применён</span>
      </div>
      <div v-else-if="status === 'error'" class="promo-status promo-status--err">
        <span>{{ message || 'Промокод не найден' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customization-promo {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #3a3a3a;
  border: 2px solid;
  border-color: #707070 #101010 #101010 #707070;
  font-family: 'Consolas', 'Courier New', monospace;
}

.promo-body {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.promo-row {
  display: flex;
  gap: 6px;
}

.promo-input {
  flex: 1 1 0;
  min-width: 0;
  padding: 5px 8px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 12px;
  color: #dcddde;
  background: #1e1e1e;
  border: 1px solid;
  border-color: #101010 #707070 #707070 #101010;
  outline: none;
}

.promo-input::placeholder {
  color: #6f7175;
}

.promo-input:focus {
  border-color: #ccc;
}

.promo-btn {
  flex: 0 0 auto;
  min-width: 84px;
  padding: 5px 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  color: #f2f2f2;
  background: #4a4a4a;
  border: 2px solid;
  border-color: #707070 #101010 #101010 #707070;
  cursor: pointer;
  transition: transform 0.1s ease, background 0.15s ease;
}

.promo-btn:hover:not(:disabled) {
  background: #565656;
}

.promo-btn:active:not(:disabled) {
  transform: scale(0.96);
  border-color: #101010 #707070 #707070 #101010;
}

.promo-btn:disabled {
  color: #8a8a8a;
  cursor: default;
}

.promo-spin {
  animation: promo-spin 0.8s linear infinite;
}

@keyframes promo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.promo-status {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  font-size: 10px;
}

.promo-status--ok {
  color: #4fd167;
  border-color: #2f6e3c;
}

.promo-status--err {
  color: #eb4b4b;
  border-color: #6e2f2f;
}
</style>