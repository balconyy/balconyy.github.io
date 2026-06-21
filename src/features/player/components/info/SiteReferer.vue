<script setup lang="ts">
import {SquareArrowOutUpRight} from '@lucide/vue';
import type {Component} from 'vue'


const {icon, href, hint} = defineProps<{
  icon: Component,
  href: string,
  hint: string,
}>()
</script>

<template>
  <a
      :href="href"
      :title="hint"
      class="icon-link"
      target="_blank"
      rel="noopener noreferrer"
  >
    <component :is="icon" class="referer-logo" />
    <SquareArrowOutUpRight class="link-icon"/>
  </a>
</template>

<style scoped>

.icon-link {
  margin: auto 0;
  width: 60px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;


  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;

  background: rgba(128, 128, 128, 0.1);
  backdrop-filter: blur(6px);

  text-decoration: none;

  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.icon-link:hover {
  background: rgba(var(--accent-color-rgb)/0.2);
  border-color: rgba(var(--accent-color-rgb)/0.5);
}

.referer-logo {
  width: 18px;
  height: 18px;
}

.link-icon {
  width: 12px;
  height: 12px;
  color: white;
}
</style>