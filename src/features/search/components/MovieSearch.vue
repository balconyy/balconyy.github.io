<script setup>
import {ref} from 'vue'
import {Search} from '@lucide/vue';

const query = ref('')
</script>

<template>
  <section class="movie-search">
    <div class="text-block">
      <div class="search-wrap">
        <input
            v-model="query"
            class="search-input"
            type="text"
            placeholder="Название фильма..."
        />
        <button class="search-button">
          <Search class="ic search" :size="24"/>
        </button>
      </div>

    </div>
  </section>
</template>

<style scoped>

.movie-search {
  display: flex;
  align-items: stretch;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.text-block {
  width: min(850px, 100%);
  z-index: 2;
  margin: 0 auto;
  position: relative;
}

.search-wrap {
  display: flex;
  align-items: center;

  margin: 0 0;


  border: 3px solid rgba(var(--accent-color-rgb)/0.4);
  border-radius: 18px;

  background: rgba(var(--ui-dark-rgb)/0.28);
  backdrop-filter: blur(10px);
  transition: 0.2s ease;

  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.search-wrap:focus-within {
  outline: none;
  background: rgba(var(--ui-dark-rgb)/0.34);
  border-color: rgba(var(--accent-color-rgb)/0.9);
  box-shadow: 0 0 0 2px var(--accent-transparent);
}


.search-input {
  flex: 1;
  padding: 12px 20px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--white);

  font-size: 18px;
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
  padding: 12px 20px;
  background: rgba(var(--accent-color-rgb)/0.4);
  color: rgba(255, 255, 255, 0.70);
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
}

.search-wrap:focus-within .search-button {
  background: rgba(var(--accent-color-rgb)/0.9);
  color: rgba(255, 255, 255, 0.9);
}

.search-wrap:focus-within .search-button:hover {
  background-color: var(--accent-color);
  color: var(--white);
}


</style>