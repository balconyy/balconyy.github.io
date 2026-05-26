<script setup>
import Background from "@/components/Background.vue";
</script>

<template>
  <Background/>
  <div class="layout">
    <main class="main-content">
      <RouterView/>
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

.main-content {
  flex: 1;
}
</style>
