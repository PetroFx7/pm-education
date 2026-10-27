<script setup lang="ts">
import { mdiCreation } from '@mdi/js'
import MdiIcon from './MdiIcon.vue'
import { useUiStore } from '../stores/ui'

const ui = useUiStore()
</script>

<template>
  <Transition name="fade">
    <div v-if="ui.levelUpInfo" class="overlay" @click.self="ui.levelUpInfo = null">
      <div class="modal panel ornate" role="dialog" aria-modal="true">
        <div class="burst"><MdiIcon :path="mdiCreation" :size="48" /></div>
        <div class="eyebrow">Новий рівень</div>
        <div class="num">{{ ui.levelUpInfo.level }}</div>
        <p>Тепер ти — <strong>{{ ui.levelUpInfo.title }}</strong></p>
        <button class="btn primary" @click="ui.levelUpInfo = null">Продовжити пригоду</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(0, 3, 14, 0.75);
  backdrop-filter: blur(4px);
}
.modal { text-align: center; max-width: 380px; width: 100%; padding: 36px 28px; }
.burst {
  width: 96px;
  height: 96px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--abyss);
  background: radial-gradient(circle, #f3c4dc, var(--rose) 60%, var(--plum));
  box-shadow: 0 0 60px rgba(180, 122, 154, 0.8);
  animation: pulse 1.6s ease-in-out infinite;
}
.num { font-family: var(--font-head); font-size: 72px; font-weight: 800; line-height: 1; margin: 8px 0; }
@keyframes pulse { 50% { transform: scale(1.06); box-shadow: 0 0 90px rgba(180, 122, 154, 1); } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
