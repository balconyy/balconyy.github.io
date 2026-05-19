<script setup>
import {ref} from "vue";

const searchInput = ref("")

function clearSearch(){

}
function requestSearch(){

}
</script>

<template>
  <div class="search-container">
    <div class="input-wrapper">
      <input
          class="search-input"
          v-model="searchInput"
          type="text"
          placeholder="Введите текст..."
          @keydown.enter.prevent="requestSearch"
      />
      <div class="icons">
        <button v-if="searchInput" class="reset-button" @click="clearSearch">
          <i class="fas fa-times"></i>
        </button>
        <button class="search-button" @click="requestSearch">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.search-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
}

.search-input {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: rgba(30, 30, 30, 0.8);
  color: #fff;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-transparent);
}

.icons {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
}
.reset-button,
.search-button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 2px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.reset-button:hover,
.search-button:hover {
  opacity: 1;
}

.reset-button i,
.search-button i {
  font-size: 18px;
  display: block;
  width: 20px;
  height: 20px;
}


</style>