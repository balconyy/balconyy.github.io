<template>
    <!-- Базовый слой: глубокий чёрный с пурпурным отливом -->
    <div class="base-layer"></div>
    <div class="square-pattern"></div>

    <!-- Тонкий муар (едва заметный) -->
    <div class="subtle-moire"></div>
    <!-- Динамические хайлайты (очень медленное движение) -->
    <div class="ambient-highlights"></div>
    <!-- Лёгкая виньетка -->
    <div class="soft-vignette"></div>
    <!-- Сканлайн (опционально, очень прозрачный) -->
    <div class="subtle-scanline"></div>

</template>

<script setup>

</script>

<style scoped>


.base-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%,
  #0f0a1a 0%,
  #08060c 50%,
  #040308 100%
  );
}

.square-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

/* Едва заметный муар (только на больших экранах для изящества) */
.subtle-moire {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(
      from 30deg at 20% 40%,
      rgba(120, 80, 160, 0.03) 0deg 10deg,
      transparent 10deg 20deg,
      rgba(90, 60, 130, 0.02) 20deg 30deg,
      transparent 30deg 40deg
  );
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* Атмосферные хайлайты (медленно перемещаются) */
.ambient-highlights {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.ambient-highlights::before,
.ambient-highlights::after {
  content: '';
  position: absolute;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: slowDrift 24s ease-in-out infinite alternate;
}

.ambient-highlights::before {
  background: radial-gradient(circle, rgba(140, 80, 200, 0.25) 0%, transparent 70%);
  top: -20%;
  left: -20%;
  animation-duration: 28s;
}

.ambient-highlights::after {
  background: radial-gradient(circle, rgba(100, 50, 150, 0.2) 0%, transparent 70%);
  bottom: -20%;
  right: -20%;
  animation-duration: 32s;
  animation-delay: -5s;
}

/* Мягкая виньетка (не агрессивная как на сплеше) */
.soft-vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.6), inset 0 0 60px rgba(30, 15, 50, 0.4);
  pointer-events: none;
}

/* Очень тонкий сканлайн (почти незаметный, но добавляет текстуры) */
.subtle-scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.03) 0px,
      rgba(0, 0, 0, 0.03) 1px,
      transparent 1px,
      transparent 4px
  );
  pointer-events: none;
  opacity: 0.4;
}

/* Анимации для медленного движения */
@keyframes slowDrift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(8%, 5%) scale(1.1);
  }
}

</style>