<script setup lang="ts">
import {BlobCustomizationDto} from "@/data/dto/blobCustomizationDto";
import {JellyRarity} from "@/models/rarity";

const props = defineProps<{
  item: BlobCustomizationDto
}>()

const rarityLabels: Record<JellyRarity, string> = {
  [JellyRarity.COMMON]: 'Обычная',
  [JellyRarity.UNCOMMON]: 'Необычная',
  [JellyRarity.RARE]: 'Редкая',
  [JellyRarity.EPIC]: 'Эпическая',
  [JellyRarity.LEGENDARY]: 'Легендарная',
}

function rarityClass(rarity: JellyRarity): string {
  return `rarity-${rarity.toLowerCase()}`
}
</script>

<template>
  <div class="card-wrapper">
    <div class="customization-info">
      <div class="customization-image-wrapper">
        <img class="customization-image" :src="item.image" :alt="item.name"/>
      </div>

      <div class="customization-texts">
        <div class="customization-details">
          <div class="customization-name">{{ item.name }}</div>

          <div class="customization-rarity" :class="rarityClass(item.rarity)">
            {{ rarityLabels[item.rarity] }}
          </div>

          <div class="customization-quote">«{{ item.quote }}»</div>
          <div class="customization-unlock">
            {{ item.unlockMethod }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  padding: 0 8px;
}

.customization-info {
  width: 100%;
  padding: 8px;
  flex: 0 0 auto;
  display: flex;
  background: #3a3a3a;
  border: 2px solid;
  border-color: #707070 #101010 #101010 #707070;
}

.customization-image-wrapper {
  flex: 1 1 0;
  min-width: 0;
  object-fit: contain;
}

.customization-image{
  width: 100%;
  margin: auto;
  aspect-ratio: 1/1;
  border-radius: 50%;
}

.customization-texts {
  flex: 2 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 4px;
  box-sizing: border-box;
  font-family: 'Consolas', 'Courier New', monospace;
  color: #dcddde;
  text-align: center;
}

.customization-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.customization-name {
  font-size: 17px;
  font-weight: 700;
  color: #f2f2f2;
  margin-bottom: 2px;
}

.customization-rarity {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.rarity-common {
  color: #dcddde;
}

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

.customization-quote {
  font-size: 13px;
  font-style: italic;
  color: #a3a6a9;
  margin-bottom: 8px;
}

.customization-unlock {
  flex-shrink: 0;
  width: 100%;
  padding: 4px 8px;
  box-sizing: border-box;
  font-size: 10px;
  color: #dcddde;
  border-radius: 6px;
  border: 1px dashed #707070;
  background: #1e1e1e;
}
</style>