<script setup lang="ts">
import {Search} from '@lucide/vue';
import {ref} from "vue";

const emit = defineEmits<{
  (e: "search", value: string): void;
}>();

const query = ref("");

const onSearch = () => {
  if (!query.value.trim()) return;
  emit("search", query.value);
};

</script>

<template>
  <section class="movie-search">
    <div class="search-type">
      <span>поиск по: название</span>
    </div>
    <div class="search-block">
      <input
          v-model="query"
          class="search-input"
          type="text"
          placeholder="Введите название..."
          @keyup.enter="onSearch"
      />
      <button class="search-button" @click="onSearch">
        <Search class="ic search" :size="24"/>
      </button>
    </div>

  </section>
</template>

<style scoped>

.movie-search {
  width: min(900px, 100%);
  display: flex;
  align-items: stretch;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 12px 0;
  gap: 8px;
  margin: 0 auto;
  z-index: 2;
}

.search-type {
  margin-left: 20px;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  color: rgba(255, 255, 255, 0.35);
}

.search-block {
  display: flex;
  align-items: center;

  margin: 0 0;

  border: 2px solid rgba(var(--accent-color-rgb)/0.4);
  border-radius: 18px;

  background: rgba(var(--ui-dark-rgb)/0.28);
  backdrop-filter: blur(10px);
  transition: 0.2s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.search-block:focus-within {
  outline: none;
  background: rgba(var(--ui-dark-rgb)/0.34);
  border-color: rgba(var(--accent-color-rgb)/0.9);
  box-shadow: 0 0 0 2px var(--accent-transparent);
}


.search-input {
  flex: 1;
  padding: 0 20px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--white);

  font-size: 16px;
  letter-spacing: 0.02em;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.search-button {
  display: block;
  padding: 8px 16px;
  background: rgba(var(--accent-color-rgb)/0.4);
  color: rgba(255, 255, 255, 0.70);
  border: none;
  cursor: pointer;
  border-radius: 0 16px  16px 0;
  transition: 0.2s ease;
}

.search-block:focus-within .search-button {
  background: rgba(var(--accent-color-rgb)/0.9);
  color: rgba(255, 255, 255, 0.9);
}

.search-block:focus-within .search-button:hover {
  background-color: var(--accent-color);
  color: var(--white);
}


</style>