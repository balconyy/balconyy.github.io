<script setup lang="ts">
import CustomizationList from './CustomizationList.vue'
import CustomizationPromo from './CustomizationPromo.vue'
import {computed, onMounted, ref} from 'vue'
import CustomizationInfo from "@/features/blob/components/CustomizationInfo.vue";
import {useCustomization} from "@/features/blob/composables/useCustomization";
import {BlobCustomizationDto} from "@/data/dto/blobCustomizationDto";

function onChange(item: BlobCustomizationDto): void {
  selectSkin(item)
}

const {
  skins,
  selected,
  isLoading,
  promoStatus,
  isPromoLoading,
  promoMessage,
  getCustomizations,
  selectSkin,
  applyPromo
} = useCustomization()

function onHold(item: BlobCustomizationDto | null): void {
  holdItem.value = item
}

const holdItem = ref<BlobCustomizationDto | null>(null)

const infoItem = computed(() => holdItem.value ?? selected.value)

const isPromoOpen = ref(false)

function togglePromo(): void {
  isPromoOpen.value = !isPromoOpen.value
}

onMounted(() => {
  getCustomizations()
})

</script>
<template>
  <div class="customization-wrapper" v-if="!isLoading">
    <CustomizationList
        :items="skins"
        @change="onChange"
        @hold="onHold"
    />

    <div class="bottom-panel">
      <button
          class="promo-button"
          @click="togglePromo"
      >
        {{ isPromoOpen ? 'Назад' : 'Промокод' }}
      </button>

      <CustomizationPromo
          v-if="isPromoOpen"
          :is-loading="isPromoLoading"
          :status="promoStatus"
          :message="promoMessage"
          @apply="applyPromo"
      />
      <CustomizationInfo
          v-else-if="infoItem"
          :item="infoItem"/>
    </div>
  </div>
</template>

<style scoped>

.customization-wrapper {
  width: 100%;
  height: 100%;
  flex: 1 0 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  color: #dcddde;
  border-left: 2px solid #2a2a2a;
  border-right: 2px solid #4a4a4a;
  border-bottom: 2px solid #4a4a4a;
  background: #1f1f1f;
}

.bottom-panel {
  position: relative;
  padding: 0 8px;
}


.promo-button {
  display: inline-flex;
  position: absolute;
  top: -16px;
  right: 8px;
  transform: translateY(-50%);
  z-index: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 10px;
  background: #3a3a3a;
  color: #f2f2f2;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  font-weight: 700;
  border: 2px solid;
  border-color: #707070 #101010 #101010 #707070;
  cursor: pointer;
  user-select: none;
  transition: background .08s;
}

.promo-button:hover {
  background: #383838;
}

.promo-button:active {
  background: #252525;
  border-color: #101010 #606060 #606060 #101010;
}

</style>