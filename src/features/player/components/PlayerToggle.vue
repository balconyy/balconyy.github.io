<script setup lang="ts">
interface Props {
  modelValue?: boolean
  offLabel?: string
  onLabel?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  offLabel: 'Плеер',
  onLabel: 'Vod'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function toggle(value: boolean): void {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="mode-toggle" role="switch" :aria-checked="modelValue">
    <span
        class="mode-toggle-label mode-toggle-label--off"
        :class="{ 'is-active': !modelValue }"
        @click="toggle(false)"
    >
      {{ offLabel }}
    </span>

    <button
        type="button"
        class="mode-toggle-track"
        :class="{ active: modelValue }"
        @click="toggle(!modelValue)"
    >
      <span class="mode-toggle-knob"/>
    </button>

    <span
        class="mode-toggle-label mode-toggle-label--on"
        :class="{ 'is-active': modelValue }"
        @click="toggle(true)"
    >
      {{ onLabel }}
    </span>
  </div>
</template>

<style scoped>
.mode-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  height: 42px;
  box-sizing: border-box;
  transition: background-color 0.18s ease,
  border-color 0.18s ease,
  box-shadow 0.18s ease;
}

.mode-toggle-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  user-select: none;
  transition: color 0.18s ease;
  white-space: nowrap;
}

.mode-toggle-label.is-active {
  color: #fff;
}

.mode-toggle-label:not(.is-active):hover {
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 0 10px color-mix(in srgb, var(--accent-color) 55%, transparent);
}

.mode-toggle-label--off {
  text-align: right;
}

.mode-toggle-label--on {
  text-align: left;
}

.mode-toggle-track {
  position: relative;
  width: 34px;
  height: 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.18s ease, box-shadow 0.18s ease;
}

.mode-toggle-track:hover {
  box-shadow: 0 0 12px color-mix(in srgb, var(--accent-color) 24%, transparent);
}

.mode-toggle-track.active {
  background: var(--accent-color);
}

.mode-toggle-track:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--accent-color) 72%, #fff);
  outline-offset: 2px;
}

.mode-toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.18s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.mode-toggle-track.active .mode-toggle-knob {
  transform: translateX(16px);
}
</style>