<script setup lang="ts">
import BaseConfigCard from "@/features/admin/components/BaseConfigCard.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {useRemoteConfigStore} from "@/store/remoteConfig";
import {Config} from "@/models/config";
import {panelApi} from "@/data/api/panel";

const configStore = useRemoteConfigStore();

const adminAlert = computed(() => configStore.remoteConfig?.adminAlert);


const form = reactive({
  adminAlert: {
    message: adminAlert.value?.message ?? "",
    link: adminAlert.value?.link ?? "",
  }
});

const cinemaForm = reactive({
  kpId: "",
});

interface QueueMovieDto {
  kpId: number;
  titleMain: string;
  year: number;
}

const queueForm = reactive({
  kpId: "",
});

const queueList = ref<QueueMovieDto[]>([]);
const isQueueLoading = ref(false);

const isLoading = ref(false);
const lastError = ref("");

function extractErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { status?: number; statusText?: string } }).response;
    if (response) {
      return `Ошибка ${response.status ?? "?"} ${response.statusText ?? ""}`.trim();
    }
  }

  return error instanceof Error ? error.message : "Неизвестная ошибка";
}

async function runAction(action: () => Promise<unknown>) {
  isLoading.value = true;

  try {
    await action();
    lastError.value = "";
  } catch (error) {
    lastError.value = extractErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
}

function applyConfig() {
  const config: Config = {
    adminAlert: {
      message: form.adminAlert.message,
      link: form.adminAlert.link,
    }
  };

  runAction(() => configStore.setConfig(config));
}

function startStreamerSync() {
  runAction(() => panelApi.syncStreamerRating());
}

function setMovie() {
  const kpId = Number(cinemaForm.kpId);

  if (!cinemaForm.kpId || !Number.isFinite(kpId)) {
    lastError.value = "Введите корректный kpId фильма";
    return;
  }

  runAction(() => panelApi.setCinemaMovie(kpId));
}

function skipMovie() {
  runAction(() => panelApi.skipCinemaMovie());
}

function stopPlayback() {
  runAction(() => panelApi.stopCinemaPlaying());
}

function enableAutoplay() {
  runAction(() => panelApi.autoplay(true));
}

function disableAutoplay() {
  runAction(() => panelApi.autoplay(false));
}

async function loadQueue() {
  isQueueLoading.value = true;

  try {
    const response = await panelApi.getQueueList();
    queueList.value = response.data;
    lastError.value = "";
  } catch (error) {
    lastError.value = extractErrorMessage(error);
  } finally {
    isQueueLoading.value = false;
  }
}

function addToQueue() {
  const kpId = Number(queueForm.kpId);

  if (!queueForm.kpId || !Number.isFinite(kpId)) {
    lastError.value = "Введите корректный kpId фильма";
    return;
  }

  runAction(async () => {
    await panelApi.addMovieToQueue(kpId);
    queueForm.kpId = "";
    await loadQueue();
  });
}

onMounted(() => {
  loadQueue();
});

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

  </div>
  <div class="button-wrapper">
    <button class="apply-button" :disabled="isLoading" @click="applyConfig">
      Применить
    </button>
  </div>

  <div class="remote-config">
    <BaseConfigCard>
      <h3>Синхронизация оценок</h3>

      <div class="description">
        Стримеры аккаунт кинопоиска
      </div>

      <button class="apply-button" :disabled="isLoading" @click="startStreamerSync">
        Запустить
      </button>
    </BaseConfigCard>

    <BaseConfigCard>
      <h3>Кинотеатр</h3>

      <div class="row">
        <span>KP ID фильма:</span>
        <input v-model="cinemaForm.kpId" type="text" class="input-config"/>
      </div>

      <div class="cinema-buttons">
        <button class="apply-button" :disabled="isLoading" @click="setMovie">
          Установить фильм
        </button>
        <button class="apply-button" :disabled="isLoading" @click="skipMovie">
          Следующий фильм
        </button>
        <button class="apply-button apply-button--danger" :disabled="isLoading" @click="stopPlayback">
          Стоп
        </button>
        <br/>
        <div class="row">
          Автоплей
        </div>
        <button class="apply-button" :disabled="isLoading" @click="enableAutoplay">
          Вкл
        </button>
        <button class="apply-button apply-button--danger" :disabled="isLoading" @click="disableAutoplay">
          Выкл
        </button>
      </div>

      <div class="description">
        Управление показом фильмов в кинотеатре
      </div>
    </BaseConfigCard>

    <BaseConfigCard>
      <h3>Очередь фильмов</h3>

      <div class="row">
        <span>KP ID фильма:</span>
        <input v-model="queueForm.kpId" type="text" class="input-config"/>
      </div>

      <div class="cinema-buttons">
        <button class="apply-button" :disabled="isLoading" @click="addToQueue">
          Добавить в очередь
        </button>
        <button class="apply-button" :disabled="isQueueLoading" @click="loadQueue">
          Обновить список
        </button>
      </div>

      <div v-if="isQueueLoading" class="description">
        Загрузка...
      </div>
      <ul v-else class="queue-list">
        <li v-for="movie in queueList" :key="movie.kpId" class="queue-item">
          <span class="queue-item__title">{{ movie.titleMain }}</span>
          <span class="queue-item__year">({{ movie.year }})</span>
          <span class="queue-item__id">kpId: {{ movie.kpId }}</span>
        </li>
        <li v-if="queueList.length === 0" class="description">
          Очередь пуста
        </li>
      </ul>

      <div class="description">
        Список фильмов в очереди на показ
      </div>
    </BaseConfigCard>
  </div>
  <div v-if="lastError" class="last-error">
    {{ lastError }}
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

.apply-button:disabled {
  background: #6b7280;
  cursor: not-allowed;
}

.apply-button--danger {
  background: #ef4444;
}

.apply-button--danger:hover {
  background: #dc2626;
}

.cinema-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 12px 0;
}

.last-error {
  margin: 20px auto;
  max-width: 500px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  font-weight: 500;
  text-align: center;
}

.remote-config {
  display: grid;
  grid-template-columns: repeat(auto-fit, 500px);
  justify-content: center;
  gap: 20px;
}

.queue-list {
  list-style: none;
  margin: 12px 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 260px;
  overflow-y: auto;
}

.queue-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--ui-dark);
}

.queue-item__title {
  font-weight: 600;
}

.queue-item__year,
.queue-item__id {
  opacity: 0.7;
  font-size: 0.9em;
}

</style>