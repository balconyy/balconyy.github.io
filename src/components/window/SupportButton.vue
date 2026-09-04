<script setup lang="ts">

</script>

<template>
  <a
      class="support-button"
      href="https://www.donationalerts.com/r/birdy_mafia"
      target="_blank"
      rel="noopener noreferrer"
  >
    Поддержать
  </a>
</template>

<style scoped>
.support-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-top: 4px;
  padding: 8px 22px;

  background: #f5a962;
  color: #2a1a08;

  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 15px;
  font-weight: 700;

  text-decoration: none;

  border: 2px solid;
  border-color: #ffd7a8 #a86a2e #a86a2e #ffd7a8;
  cursor: pointer;
  user-select: none;

  transition: background 0.08s;
}

.support-button:hover {
  background: #f7b676;
}

.support-button:active {
  background: #e79a4e;
  border-color: #a86a2e #ffd7a8 #ffd7a8 #a86a2e;
  transform: translate(1px, 1px);
}
</style>