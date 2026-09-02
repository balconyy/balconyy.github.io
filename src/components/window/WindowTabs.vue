<!-- WindowTabs.vue -->
<script setup>
import {computed} from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'Главная'
  },

  tabs: {
    type: Array,
    default: () => [
      'Главная',
      'Лидеры',
      'Кейс',
      'Скины'
    ]
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const activeTab = computed(() => props.modelValue)

function selectTab(tab) {
  emit('update:modelValue', tab)
  emit('change', tab)
}
</script>

<template>
  <div class="window-tabs">
    <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        class="window-tab"
        :class="{ 'window-tab--active': activeTab === tab }"
        @click="selectTab(tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<style scoped>
.window-tabs {
  display: flex;
  gap: 0;
  padding-left: 3px;

  background: #3a3a3a;

  font-family: "MS Sans Serif",
  Tahoma,
  Arial,
  sans-serif;

}

.window-tab {
  position: relative;

  min-width: 55px;

  padding: 5px 9px;

  background: #3a3a3a;
  color: #d6d6d6;
  border: 1px solid;
  border-color: #555 #151515 transparent #555;

  font-family: inherit;
  font-size: 13px;
  line-height: 1;

  white-space: nowrap;
  user-select: none;

  cursor: default;
  outline: none;

  z-index: 1;
}


.window-tab--active {
  z-index: 10;

  background: #1f1f1f;
  color: #f0f0f0;


  border-bottom-color: #1f1f1f;

  box-shadow: inset 1px 1px 0 #777,
  inset -1px 0 0 #111;
}

.window-tab:hover {
  color: #ffffff;
  background: #424242;
}

.window-tab--active:hover {
  background: #1f1f1f;
}


</style>