<script setup>
import {computed} from "vue";

const {message, link} = defineProps({
  message: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },
})

const isClickable = computed(() => link);

function href() {
  if(link) {
    window.location.href = link
  }
}
</script>

<template>
  <div :class="['alert-wrapper', { clickable: isClickable }]">
    <div class="alert" @click="href">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>

.alert-wrapper {
  display: flex;
  align-content: center;
}

.alert {
  color: var(--white);
  text-align: center;
  display: inline-flex;
  gap: 20px;
  padding: 10px 20px;
  font-size: 1.2rem;
  border: 1px solid var(--alert-color);
  border-radius: 5px;
  margin: auto;
  background: var(--alert-color-transparent);
}

.clickable {
  cursor: pointer;
}

</style>
