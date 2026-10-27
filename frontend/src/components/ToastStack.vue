<script setup lang="ts">
import { mdiStarFourPoints, mdiGold, mdiTrophy, mdiCloudSync } from '@mdi/js'
import MdiIcon from './MdiIcon.vue'
import { useUiStore } from '../stores/ui'

const ui = useUiStore()

const EYEBROW = { reward: 'Нагорода', achievement: 'Досягнення', info: 'Хмара' }
</script>

<template>
  <div class="toasts" aria-live="polite">
    <TransitionGroup name="toast">
      <button v-for="t in ui.toasts" :key="t.id" class="toast" :class="t.kind" @click="ui.dismiss(t.id)">
        <div class="ico">
          <MdiIcon :path="t.kind === 'achievement' ? t.icon || mdiTrophy : t.kind === 'info' ? mdiCloudSync : mdiStarFourPoints" :size="22" />
        </div>
        <div class="body">
          <div class="eyebrow">{{ EYEBROW[t.kind] }}</div>
          <div class="title">{{ t.title }}</div>
          <div v-if="t.kind === 'reward'" class="loot">
            <span>+{{ t.xp }} XP<small v-if="t.bonus"> (класовий бонус +{{ t.bonus }})</small></span>
            <span v-if="t.gold" class="gold"><MdiIcon :path="mdiGold" :size="14" /> +{{ t.gold }}</span>
          </div>
          <div v-else class="muted small">{{ t.desc }}</div>
        </div>
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(360px, calc(100vw - 32px));
}
.toast {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  text-align: left;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--line-strong);
  background: rgba(26, 18, 32, 0.95);
  box-shadow: 0 12px 40px rgba(0, 3, 14, 0.7), var(--glow);
  cursor: pointer;
}
.toast.achievement { border-color: var(--gold); }
.toast.achievement .ico { background: linear-gradient(135deg, var(--gold), var(--rose)); }
.ico {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--rose), var(--plum));
  color: var(--abyss);
  flex-shrink: 0;
}
.title { font-weight: 800; line-height: 1.3; margin: 2px 0 4px; }
.loot { display: flex; gap: 14px; font-size: 14px; font-weight: 700; color: var(--rose); }
.loot small { color: var(--text-faint); font-weight: 500; }
.gold { color: var(--gold); display: inline-flex; align-items: center; gap: 4px; }
.small { font-size: 13px; }
.toast-enter-active, .toast-leave-active { transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
.toast-enter-from { opacity: 0; transform: translateX(40px) scale(0.95); }
.toast-leave-to { opacity: 0; transform: translateX(40px); }
</style>
