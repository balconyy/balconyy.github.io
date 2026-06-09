<script setup>

import NavigationBar from "@/features/admin/components/NavigationBar.vue";
import RemoteConfig from "@/features/admin/components/config/RemoteConfig.vue";
</script>

<template>
  <div class="layout">
    <NavigationBar class="navbar"/>
    <div class="content">
      <RemoteConfig/>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
}

.navbar {
  flex: 0 0 auto;
}

.content {
  flex: 1;
  min-width: 0;
  padding: 20px;
  background: black;
}
</style>