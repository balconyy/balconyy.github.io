<script setup>
import Pc from '@/assets/media/geek-pc.png'
import {useAnalytics} from "@/composables/useAnalytics.ts";

const analytics = useAnalytics()

function onGeekClicked() {
  window.location.assign('tg://resolve?domain=qulyaba&post=4995');
  analytics.track('geeknews_clicked');
}
</script>

<template>
  <section class="telegram-geek">
    <a @click="onGeekClicked">
      <div class="geek-content">
        <div class="geek-content-wrapper">
          <h3 class="channel-name">Розыгрыш ПК<br>в тг-канале!</h3>
          <img class="geek-pc" :src="Pc" alt="Гик Новости. Аватарка"/>
        </div>
        <p class="subscribe-button">
          ГикНовости. Подписаться
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


.geek-content {
  width: 200px;
  background: linear-gradient(145deg, #1691c7 0%, #0c6f99 100%);
  border-radius: 20px;
  padding: 8px;
  display: flex;
  gap: 8px;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  border: 2px solid var(--white);
}

.geek-content:hover {
  transform: translateY(-3px);
  background: linear-gradient(145deg, #29a9e1 0%, #1c8fc0 100%);
  box-shadow: 0 8px 20px rgba(41, 169, 225, 0.4),
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


.geek-pc {
  height: 54px;
  display: flex;
  flex-shrink: 0;
  object-fit: cover;
  -webkit-user-drag: none;
}

.channel-name {
  font-weight: 800;
  font-size: 15px;
  color: white;
  line-height: 1.2;
  letter-spacing: 0.05em;
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