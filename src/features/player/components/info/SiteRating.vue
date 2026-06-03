<script setup>
import {SquareArrowOutUpRight} from '@lucide/vue';

defineProps({
  iconSrc: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  }
})

</script>

<template>
  <a
      :href="href"
      class="icon-link"
      target="_blank"
      rel="noopener noreferrer"
  >
    <img class="referer-logo" :src="iconSrc" alt="icon"/>
    <SquareArrowOutUpRight class="link-icon"/>
  </a>
</template>

<style scoped>
.icon-link {
  width: 60px;


  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;


  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 6px;

  background: rgba(128, 128, 128, 0.1);
  backdrop-filter: blur(6px);

  text-decoration: none;

  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.icon-link:hover {
  background: rgba(var(--accent-color-rgb)/0.2);
  border-color: rgba(var(--accent-color-rgb)/0.5) ;
}

.referer-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.link-icon {
  width: 12px;
  height: 12px;
  color: white;
}
</style>