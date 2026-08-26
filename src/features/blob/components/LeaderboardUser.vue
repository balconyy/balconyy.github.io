<script setup lang="ts">
import {BlobLeaderDto} from "@/data/dto/blobLeaderDto";

defineProps<{
  row: BlobLeaderDto
}>()
</script>

<template>
  <div class="user-content">
    <div class="place">
      {{ row.place }}
    </div>

    <div class="user-info">
      <img
          class="avatar"
          :src="row.avatar"
          :alt="row.displayName"/>
      <span class="name" :style="{ color: row.nameColor }">
        {{ row.displayName }}
      </span>
    </div>
    <img
        class="badge"
        :src="row.skin"
        alt=""/>

    <div class="score">
      {{ row.score }}
    </div>
  </div>
</template>

<style scoped>
.user-content {
  display: flex;
  align-items: center;
}

.place {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
  width: 30px;
  margin: 8px 0;
  padding: 0 4px;
  border-radius: 2px;
  border: 2px solid;
  border-color: #7a7a7a #3a3a3a #3a3a3a #7a7a7a;
  background: #1a1a1a;
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 1 auto;
  min-width: 0;
  padding: 8px 12px 8px 12px;
}

.avatar {
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 2px;
  object-fit: cover;
  border: 2px solid;
  border-color: #7a7a7a #3a3a3a #3a3a3a #7a7a7a;
  background: #1a1a1a;
}

.badge {
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

.score {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 50px;
  width: 50px;
  margin: 8px 0;
  padding: 0 4px;
  border-radius: 2px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
</style>