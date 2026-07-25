<script setup>
import Kryptonymous from '@/assets/media/kryptonymous.png'

</script>

<template>
  <div class="work-card">
    <div class="card-inner">
      <div class="contacts">
        <h3 class="title-message">balcony.film@proton.me</h3>

        <div class="contact-item">
          <span class="icon">📢</span>
          <a
              href="tg://resolve?domain=balcony_dev"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link"
          >
            канал с обновлениями
          </a>
        </div>

        <div class="contact-item">
          <span class="icon">💬</span>
          <a
              href="tg://resolve?domain=nigeriam"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link"
          >
            написать разработчику
          </a>
        </div>
      </div>

      <div class="photo-area">
        <img class="kryptonymous-avatar" :src="Kryptonymous" alt="my face"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

.work-card {
  filter: contrast(2) brightness(1.2);
  background: black;
  border: 2px solid;
  border-color: #bdbdbd #7f7f7f #7f7f7f #bdbdbd;
  box-shadow: 1px 1px 0 0 #00000022;
  font-family: 'Segoe UI', 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 11px;
}

.card-inner {
  display: flex;
  padding: 8px 6px;
  gap: 8px;
}

.contacts {
  flex: 1;
}

.title-message {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: bold;
  color: #AA00AA;
  border-bottom: 2px solid #7f7f7f;
  padding-bottom: 2px;
  font-family: 'Tahoma', monospace;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}

.icon {
  font-size: 11px;
  width: 14px;
  text-align: center;
}

.contact-link {
  color: #AA00AA;
  font-family: 'Segoe UI', sans-serif;
  padding: 1px 0;
  text-decoration: underline;
  font-size: 12px;
}

.contact-link:hover {
  background: #AA00AA;
  color: #ffffff;
}


.photo-area {
  width: 48px;
  height: 74px;
  background: #c0c0c0;
  border: 1px inset #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: auto;
  position: relative;
}

.photo-area::after {
  z-index: 3;
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.3) 1px,
      transparent 2px,
      transparent 3px
  );
  pointer-events: none;
  mix-blend-mode: multiply;
  opacity: 0.35;
}

.kryptonymous-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: relative;
  z-index: 1;
}

</style>