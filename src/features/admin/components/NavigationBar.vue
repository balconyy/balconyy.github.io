<script setup>
import {BookText, Banana} from '@lucide/vue';
</script>


<template>
  <aside class="navbar">
    <BookText class="nav-item"/>
    <Banana class="nav-item"/>
  </aside>
</template>

<style scoped>
.navbar {
  z-index: 2;
  height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  bottom: 0;
  display: inline-flex;
  flex-direction: column;
  padding: 20px 12px;
  gap: 24px;
  background: #1f2937;
}

.nav-item {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #cbd5e1;
  text-decoration: none;
  transition: 0.2s;
}

.nav-item:hover {
  background: #1f2937;
  color: white;
}

</style>