<script setup lang="ts">
import BaseConfigCard from "@/features/admin/components/config/BaseConfigCard.vue";
import {computed, reactive} from "vue";
import {useRemoteConfigStore} from "@/store/remoteConfig";
import {Config} from "@/models/config";

const configStore = useRemoteConfigStore();
const donation = computed(() => configStore.remoteConfig.donationInfo);
const adminAlert = computed(() => configStore.remoteConfig.adminAlert);

const form = reactive({
  adminAlert: {
    message: adminAlert.value?.message ?? "",
    link: adminAlert.value?.link ?? "",
  },
  donationInfo: {
    donationText: donation.value?.donationText ?? "",
    moneyNow: donation.value?.moneyNow ?? 0,
    moneyTotal: donation.value?.moneyTotal ?? 0,
  },
});

function applyConfig() {
  const config: Config = {
    adminAlert: {
      message: form.adminAlert.message,
      link: form.adminAlert.link,
    },
    donationInfo: {
      donationText: form.donationInfo.donationText,
      moneyNow: Number(form.donationInfo.moneyNow),
      moneyTotal: Number(form.donationInfo.moneyTotal),
    },
  };
  configStore.setConfig(config);
}
</script>

<template>
  <div class="remote-config">
    <BaseConfigCard>
      <h3>Admin Alert</h3>

      <div class="row">
        <span>Сообщение от админа:</span>
        <input v-model="form.adminAlert.message" type="text" class="input-config"/>
      </div>

      <div class="row">
        <span>Ссылка при нажатии:</span>
        <input v-model="form.adminAlert.link" type="text" class="input-config"/>
      </div>

      <div class="description">
        На главной экране отображает оранжевое сообщение от администрации, с возможностью редиректа при клике
      </div>
    </BaseConfigCard>

    <BaseConfigCard>
      <h3>Donation Info</h3>

      <div class="row">
        <span>Заголовок в полоске доната:</span>
        <input v-model="form.donationInfo.donationText" type="text" class="input-config"/>
      </div>

      <div class="row">
        <span>Денег сейчас:</span>
        <input v-model.number="form.donationInfo.moneyNow" type="number" class="input-config"/>
      </div>

      <div class="row">
        <span>Денег всего:</span>
        <input v-model.number="form.donationInfo.moneyTotal" type="number" class="input-config"/>
      </div>

      <div class="description">
        Управление полосой донатов на главной
      </div>
    </BaseConfigCard>
  </div>
  <div class="button-wrapper">
  <button class="apply-button" @click="applyConfig">
    Применить
  </button>
  </div>
</template>

<style scoped>
.input-config{
  color: white;
  background-color: var(--ui-dark);
}
.button-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}
.apply-button {
  padding: 10px 12px;
  background: #22c55e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.apply-button:hover {
  background: #16a34a;
}

.remote-config {
  display: grid;
  grid-template-columns: repeat(auto-fit, 500px);
  justify-content: center;
  gap: 20px;
}

</style>