<script setup>
import avatar from '@/assets/media/geek-avatar.jpg'
</script>

<template>
  <section class="telegram-geek">
    <div class="support-title">При поддержке тг-канала</div>
    <a href="https://t.me/qulyaba">
    <div class="geek-content">
        <div class="geek-content-wrapper">
          <img class="avatar" :src="avatar" alt="Гик Новости. Аватарка"/>
          <div class="search-block">
            <div class="channel-name">Гик Новости</div>
            <div class="channel-description">Для тех кто в теме</div>
          </div>
        </div>
        <p class="subscribe-button">
          Подписаться
        </p>
    </div>
    </a>
  </section>
</template>

<style scoped>

.telegram-geek {
  position: static;
  margin: 0;

  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.support-title {
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3cap;
  color: rgba(var(--white-rgb) /0.85);
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  margin-bottom: 2px;
}

.geek-content {
  width: 200px;
  background: linear-gradient(145deg, #1691c7 0%, #0c6f99 100%);
  border-radius: 20px;
  padding: 10px;
  display: flex;
  gap: 6px;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  border: 2px solid var(--white);
}

.geek-content:hover {
  transform: translateY(-3px);
  background: linear-gradient(145deg, #29a9e1 0%, #1c8fc0 100%);
  box-shadow:
      0 8px 20px rgba(41, 169, 225, 0.4),
      0 0 15px rgba(41, 169, 225, 0.3),
      inset 0 1px 1px rgba(255, 255, 255, 0.3);
}

.geek-content-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
}


.avatar {
  width: 44px;
  height: 44px;
  background: rgba(var(--white-rgb)/0.25);
  backdrop-filter: blur(2px);
  display: flex;
  flex-shrink: 0;
  border-radius: 50%;
  box-shadow: 0 3px 20px rgba(0, 0, 0, 0.3);
  object-fit: cover;
  -webkit-user-drag: none;
  border: 1px solid var(--white);
}

.search-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.channel-name {
  font-weight: 800;
  font-size: 16px;
  color: white;
  line-height: 1.2;
  letter-spacing: 0.05em;
}

.channel-description {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.subscribe-button {
  font-size: 9px;
  font-weight: 600;
  color: white;
  background: rgba(0, 0, 0, 0.25);
  padding: 2px 16px;
  border-radius: 30px;
  width: fit-content;
  margin: auto;
  transition: background 0.2s ease;
  backdrop-filter: blur(2px);
}

.geek-content:hover .subscribe-button {
  background: rgba(0, 0, 0, 0.5);
}

</style>