<template>
    <div class="base-layer"></div>
    <div class="square-pattern"></div>


</template>

<script setup>

</script>

<style scoped>


.base-layer {
  pointer-events: none;
  z-index: -1;
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at 50% 50%,
  #0f0a1a 0%,
  #08060c 50%,
  #040308 100%
  );

}

.square-pattern {
  z-index: 1;
  position: fixed;
  inset: 0;
  min-height: 100%;
  background-image:
      repeating-linear-gradient(
          60deg,
          transparent,
          transparent 29px,
          rgba(var(--accent-color-rgb) / 0.06) 29px,
          rgba(var(--accent-color-rgb) / 0.10) 32px,
          transparent 32px,
          transparent 60px
      ),
      repeating-linear-gradient(
          120deg,
          transparent,
          transparent 29px,
          rgb(var(--accent-color-rgb) / 0.06) 29px,
          rgba(var(--accent-color-rgb) / 0.10) 32px,
          transparent 32px,
          transparent 60px
      );
  opacity: 0.4;
}
.base-layer,
.square-pattern {
  pointer-events: none;
}

</style>