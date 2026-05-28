<template>
  <aside class="navbar">
    <RouterLink to="/" class="nav-item" active-class="active">
      <Home class="icon" />
    </RouterLink>

    <RouterLink to="/about" class="nav-item" active-class="active">
      <Info class="icon" />
    </RouterLink>
  </aside>
</template>

<script setup>
import { Home, Info } from '@lucide/vue';
</script>

<style scoped>
.navbar {
  z-index: 2;
  width: 24px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--accent-black);
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 2px;
  border-radius: 8px;
  color: #cbd5e1;
  text-decoration: none;
  transition: 0.2s;
}

.nav-item:hover {
  background: #1f2937;
  color: white;
}

.active {
  background: #2563eb;
  color: white;
}

.icon {
  width: 18px;
  height: 18px;
}
</style>