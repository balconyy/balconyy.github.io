<script setup>

import Panel from "@/features/admin/components/Panel.vue";
</script>

<template>
  <div class="background"></div>

  <Panel/>
</template>

<style scoped>


.background {
  position: absolute;
  inset: 0;
  background: black;
}

.content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>