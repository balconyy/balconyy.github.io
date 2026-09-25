<script setup lang="ts">
import {ref, watch} from 'vue'

// items: PlayerSelectorItem[] — { key, label, children? }. Форма одинакова и
// для стрим-плееров, и для vod-роликов, PlayerModal не знает о деталях
// конкретного типа плеера. children заполняются только у сгруппированных
// vod-пунктов (сериал / фильм на несколько записей), у остальных пунктов
// его нет — они остаются плоскими и кликабельными, как раньше.

interface PlayerSelectorItem {
  key: string
  label: string
  children?: PlayerSelectorItem[]
}

interface Props {
  items: PlayerSelectorItem[]
  selectedKey?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  selectedKey: null
})

const emit = defineEmits<{
  close: []
  select: [item: PlayerSelectorItem]
}>()

const selectItem = (item: PlayerSelectorItem) => {
  emit('select', item)
  emit('close')
}

const isSelected = (item: PlayerSelectorItem) => props.selectedKey === item.key

/** Группа подсвечивается, если внутри неё сейчас проигрывается ролик. */
const isGroupActive = (item: PlayerSelectorItem) =>
    item.children?.some(child => child.key === props.selectedKey) ?? false

const expandedKeys = ref<Set<string>>(new Set())

const toggleGroup = (key: string): void => {
  const next = new Set(expandedKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedKeys.value = next
}

const isExpanded = (key: string): boolean => expandedKeys.value.has(key)

/** Группа с активным сейчас роликом раскрывается сама, чтобы было видно выбор. */
watch(
    () => props.items,
    items => {
      for (const item of items) {
        if (isGroupActive(item)) expandedKeys.value.add(item.key)
      }
    },
    {immediate: true}
)
</script>

<template>
  <div class="modal" @click.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <button class="close" @click="$emit('close')">&times;</button>

      <h2>Выберите источник</h2>
      <ul class="players-list">
        <li v-for="item in items" :key="item.key">
          <template v-if="item.children">
            <button
                type="button"
                :class="['player-item', 'group-item', { active: isGroupActive(item) }]"
                @click="toggleGroup(item.key)"
            >
              <span>{{ item.label }}</span>
              <span :class="['chevron', { open: isExpanded(item.key) }]">&#8250;</span>
            </button>

            <ul v-if="isExpanded(item.key)" class="group-children">
              <li v-for="child in item.children" :key="child.key">
                <button
                    :class="['player-item', 'child-item', { active: isSelected(child) }]"
                    @click="selectItem(child)"
                >
                  {{ child.label }}
                </button>
              </li>
            </ul>
          </template>

          <button
              v-else
              :class="['player-item', { active: isSelected(item) }]"
              @click="selectItem(item)"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>


<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.modal-content {
  background: #2d2d2d;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #1f1f1f #2d2d2d;
  color: #fff;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
}

h2 {
  margin-top: 0;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
}

.players-list {
  list-style: none;
  padding: 0;
  margin: 15px 0;

}

.players-list li {
  margin: 6px 0;
}

.player-item {
  width: 100%;
  text-align: left;
  padding: 10px;
  background-color: #444;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.player-item:hover {
  background-color: var(--accent-transparent);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.player-item.active {
  background-color: var(--accent-color);
  box-shadow: 0 0 5px var(--accent-semi-transparent);
}

.group-item {
  justify-content: space-between;
  margin: 8px 0 0 0;
}

.chevron {
  display: inline-block;
  transition: transform 0.2s;
  font-size: 1.2rem;
  line-height: 1;
}

.chevron.open {
  transform: rotate(90deg);
}

.group-children {
  --tree-line-color: rgba(255, 255, 255, 0.3);
  --tree-indent: 22px;
  list-style: none;
  padding-left: 12px;
  padding-right: 16px;
  margin: 4px 0 12px 0;
}

/* Пункт дерева: слева зарезервировано место под "хребет" + горизонтальную ветку,
   как в классическом Windows-дереве (Explorer / Registry Editor). */
.group-children li {
  position: relative;
  margin: 0;
  padding: 3px 0 3px var(--tree-indent);
}

/* Вертикальный "хребет", соединяющий соседние пункты сверху вниз. */
.group-children li::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-left: 1px dotted var(--tree-line-color);
}

/* У последнего пункта хребет обрывается на середине — линия не тянется
   дальше последней ветки, как это выглядит в нативном Windows-дереве. */
.group-children li:last-child::before {
  bottom: auto;
  height: 50%;
}

/* Горизонтальная ветка от хребта к самому пункту. */
.group-children li::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: calc(var(--tree-indent));
  border-top: 1px dotted var(--tree-line-color);
}

.child-item {
  background-color: #3a3a3a;
  font-size: 0.95rem;
}


</style>