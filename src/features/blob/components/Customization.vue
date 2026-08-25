<script setup lang="ts">
import CustomizationList from './CustomizationList.vue'
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
  getCustomizations,
  selectSkin
} = useCustomization()

function onHold(item: BlobCustomizationDto | null): void {
  holdItem.value = item
}

const holdItem = ref<BlobCustomizationDto | null>(null)

const infoItem = computed(() => holdItem.value ?? selected.value)

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
    <CustomizationInfo
        v-if="infoItem"
        :item="infoItem"/>
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

</style>