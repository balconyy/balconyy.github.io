<script setup lang="ts">
// Контракт медиа-компонента: props { src }, emits { loaded, error }.
// Всё специфичное для iframe (allowfullscreen, замер времени загрузки)
// живёт здесь и не протекает в PlayerContainer.

interface Props {
  src?: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  loaded: []
  error: [event: Event]
}>()

const onLoad = (): void => {
  ;(window as Window & {iframeLoadTime?: number}).iframeLoadTime = Date.now()
  emit('loaded')
}
</script>

<template>
  <iframe
      :src="src ?? undefined"
      frameborder="0"
      allowfullscreen
      webkitallowfullscreen
      @load="onLoad"
      @error="emit('error', $event)"
  />
</template>