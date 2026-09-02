<script setup lang="ts">
import caseImage from "@/assets/media/case.png";
import coinImage from "@/assets/media/balcoin.png";
import {useCaseOpener} from "@/features/blob/composables/useCaseOpener";
import {onMounted} from "vue";
import CaseRoulette from "@/features/blob/components/CaseRoulette.vue";
import WindowLoading from "@/components/window/WindowLoading.vue";

const CASE_PRICE = 49;

const {
  isRouletteOpen,
  isBalanceLoading,
  isEquipLoading,
  isCaseLoading,
  balance,
  availableSkins,
  winner,
  caseError,
  getBalance,
  openJellyCase,
  selectSkin,
  endRoulette
} = useCaseOpener()

onMounted(() => {
  getBalance()
})

function handleEquip() {
  if (!winner.value) return
  selectSkin(winner.value.id)
  endRoulette()
}

function handleClose() {
  endRoulette()
}
</script>

<template>
  <div class="case-container">

    <div class="balance-row" v-if="!isBalanceLoading">
      <span class="label">Баланс:</span>
      <span class="value">{{ balance }}</span>
      <img class="coin-icon" :src="coinImage" alt="coin"/>
    </div>
    <WindowLoading v-else/>
    <div class="divider"></div>
    <img class="case-image" :src="caseImage" alt="case"/>
    <div class="price-row">
      <span class="label">Цена:</span>
      <span class="value">{{ CASE_PRICE }}</span>
      <img class="coin-icon" :src="coinImage" alt="coin"/>
    </div>

    <button
        class="open-button"
        :disabled="isBalanceLoading && isCaseLoading && isEquipLoading"
        @click="openJellyCase"
    >
      Открыть
    </button>

    <div class="error-field">
      <span v-if="caseError" class="error-text">{{ caseError }}</span>
    </div>

    <div class="info-block">
      <span class="info-title">Как получить Бэлкоины?</span>
      <img class="info-coin" :src="coinImage" alt="coin"/>
      <ul class="info-list">
        <li>Когда вы оказываете поддержку проекту через DonationAlerts, происходит конвертация <strong>1&nbsp;Рубль&nbsp;=&nbsp;1&nbsp;Бэлкоин</strong>.
        </li>
        <li>При отправки доната указывайте свой ник, как на сайте, тогда всё зачислится автоматически.</li>
        <li>В случае проблем, напишите в поддержку, выдадим вручную.</li>
      </ul>
    </div>

    <a
        class="support-button"
        href="https://www.donationalerts.com/r/birdy_mafia"
        target="_blank"
        rel="noopener noreferrer"
    >
      Поддержать
    </a>

    <CaseRoulette
        v-if="winner && isRouletteOpen"
        :available-skins="availableSkins"
        :winner="winner"
        @equip="handleEquip"
        @claim="handleClose"
        @close="handleClose"
    />

  </div>
</template>

<style scoped>
.case-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: #1f1f1f;
  font-family: 'JetBrains Mono', 'Consolas', 'Courier New', monospace;
  color: #dcddde;
  border-left: 2px solid #2a2a2a;
  border-right: 2px solid #4a4a4a;
  border-bottom: 2px solid #4a4a4a;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #2b2d31 #1f1f1f;
}

.case-image {
  margin-top: 20px;
  max-height: 100px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45));
}

.divider {
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a3c42, transparent);
}

.balance-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 16px;
  text-align: center;

}

.price-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  text-align: center;
  opacity: 0.9;
}

.label {
  font-weight: 700;
  color: #dcddde;
  letter-spacing: 0.15em;
}

.value {
  font-weight: 700;
  color: #f5da8c;
}

.price-row .label {
  font-weight: 500;
  color: #9a9b9e;
  letter-spacing: 0.08em;
}

.price-row .value {
  font-weight: 500;
  color: #b7ac86;
}

.coin-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.price-row .coin-icon {
  width: 14px;
  height: 14px;
}

.error-field {
  width: 100%;
  min-height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 24px;
}

.error-text {
  font-size: 12px;
  color: #CA0000;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.open-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 8px 20px;

  background: #5fa603;
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

.open-button:hover:not(:disabled) {
  background: #6bb60a;
}

.open-button:active:not(:disabled) {
  background: #457c02;
  border-color: #101010 #606060 #606060 #101010;
  transform: translate(1px, 1px);
}

.open-button:disabled {
  opacity: .5;
  cursor: default;
}

.divider {
  width: 100%;
  height: 0;
  border-top: 1px solid #2a2a2a;
  box-shadow: 0 1px 0 #4a4a4a;
}

.info-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 500px;
  padding: 14px 12px 10px;
  box-sizing: border-box;
  background: #161616;
  border: 1px dashed #4a4a4a;
  border-radius: 4px;
}

.info-title {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.08em;
  text-align: center;
}

.info-coin {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.info-list {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
  font-size: 11px;
  line-height: 1.6;
  color: #9a9b9e;
  text-align: left;
  hyphens: auto;
}

.info-list li {
  position: relative;
  padding-left: 14px;
}

.info-list li + li {
  margin-top: 6px;
}

.info-list li::before {
  content: "-";
  position: absolute;
  left: 0;
  color: #9a9a9a;
}

.info-list strong {
  font-weight: 700;
  color: #aaaaaa;
}

.support-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-top: 4px;
  padding: 8px 22px;

  background: #f5a962;
  color: #2a1a08;

  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 15px;
  font-weight: 700;

  text-decoration: none;

  border: 2px solid;
  border-color: #ffd7a8 #a86a2e #a86a2e #ffd7a8;
  cursor: pointer;
  user-select: none;

  transition: background .08s;
}

.support-button:hover {
  background: #f7b676;
}

.support-button:active {
  background: #e79a4e;
  border-color: #a86a2e #ffd7a8 #ffd7a8 #a86a2e;
  transform: translate(1px, 1px);
}
</style>