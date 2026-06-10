<script setup lang="ts">
import BaseConfigCard from "@/features/admin/components/config/BaseConfigCard.vue";
import {computed, reactive} from "vue";
import {useRemoteConfigStore} from "@/store/remoteConfig";
import {Config} from "@/models/config";

const configStore = useRemoteConfigStore();

const donation = computed(() => configStore.remoteConfig.donationInfo);
const adminAlert = computed(() => configStore.remoteConfig.adminAlert);
const dailyJoke = computed(() => configStore.remoteConfig.dailyJoke);

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
  dailyJoke: {
    url: dailyJoke.value?.url ?? "",
    height: dailyJoke.value?.height ?? 0,
    weight: dailyJoke.value?.weight ?? 0,
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
    dailyJoke: {
      url: form.dailyJoke.url,
      height: Number(form.dailyJoke.height),
      weight: Number(form.dailyJoke.weight),
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

    <BaseConfigCard>
      <h3>Daily Joke</h3>

      <div class="row">
        <span>URL картинки:</span>
        <input v-model="form.dailyJoke.url" type="text" class="input-config"/>
      </div>

      <div class="row">
        <span>Высота изображения:</span>
        <input v-model.number="form.dailyJoke.height" type="number" class="input-config"/>
      </div>

      <div class="row">
        <span>Ширина изображения:</span>
        <input v-model.number="form.dailyJoke.weight" type="number" class="input-config"/>
      </div>

      <div class="description">
        Настройка блока "Прикол Дня". Нужно выставить базовую ширину и длину картинки, чтобы она полностью входила для
        пользователя. Для квадратного фото нормально 200 на 200. Пляшем от этих размеров и прибавляем в сторону той
        стороны которая больше.
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
.input-config {
  color: white;
  background-color: var(--ui-dark);
}

.button-wrapper {
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