<script setup lang="ts"></script>

<template>
  <div class="config-card">
    <div class="config-content">
      <slot/>
    </div>
  </div>
</template>

<style>
.config-card {
  position: relative;
  width: 100%;
  max-width: 520px;
  padding: 16px;
  border-radius: 12px;
  background: #1e1e1e;
  color: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}

.config-change-button {
  position: absolute;
  top: 10px;
  right: 10px;

  width: 34px;
  height: 34px;

  background: #ffd400;
  border: none;
  border-radius: 6px;

  cursor: pointer;
  font-size: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.config-change-button:hover {
  filter: brightness(1.05);
}

.config-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}


.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

a {
  color: #7ab7ff;
  word-break: break-all;
}

.description {
  margin-top: 10px;
  padding: 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
}
</style>