<script setup lang="ts">
import { computed, ref } from 'vue'
import { mdiTreasureChest, mdiGold, mdiLock, mdiHelp } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import { modules } from '../services/course'
import { ARTIFACTS, RARITY } from '../data/world'
import { useHeroStore } from '../stores/hero'
import type { Artifact, CourseModule } from '../domain/types'

const hero = useHeroStore()
const opening = ref<number | null>(null)
const loot = ref<{ item: Artifact; gold: number; mod: CourseModule } | null>(null)

const chests = computed(() =>
  modules.map((m) => {
    const s = hero.moduleStats(m)
    return { mod: m, state: s.chestOpened ? 'opened' : s.chestReady ? 'ready' : 'locked' }
  }),
)

function open(mod: CourseModule) {
  if (opening.value) return
  opening.value = mod.id
  setTimeout(() => {
    const r = hero.openChest(mod)
    opening.value = null
    if (r) loot.value = { ...r, mod }
  }, 900)
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div class="eyebrow">Скарбниця</div>
      <h1>Скрині та артефакти</h1>
      <p class="muted">Кожна пройдена локація (усі квести + переможений бос) дарує скриню із золотом і випадковим артефактом.</p>
      <span class="chip gold"><MdiIcon :path="mdiGold" :size="16" /> {{ hero.gold }} золота</span>
    </header>

    <section>
      <h2 class="section-title">Скрині локацій</h2>
      <div class="chests">
        <button
          v-for="c in chests"
          :key="c.mod.id"
          class="chest"
          :class="[c.state, { shaking: opening === c.mod.id }]"
          :disabled="c.state !== 'ready'"
          @click="open(c.mod)"
        >
          <MdiIcon :path="c.state === 'locked' ? mdiLock : mdiTreasureChest" :size="36" />
          <strong>{{ c.mod.location }}</strong>
          <small>{{ c.state === 'ready' ? 'Відкрити!' : c.state === 'opened' ? 'Відкрито' : `Модуль ${c.mod.id}` }}</small>
        </button>
      </div>
    </section>

    <section>
      <h2 class="section-title">Колекція артефактів <span class="muted">{{ Object.keys(hero.inventory).length }}/{{ ARTIFACTS.length }}</span></h2>
      <div class="artifacts">
        <div
          v-for="a in ARTIFACTS"
          :key="a.id"
          class="artifact panel"
          :class="{ owned: hero.inventory[a.id] }"
          :style="{ '--rarity': RARITY[a.rarity].color }"
        >
          <span class="a-ico"><MdiIcon :path="hero.inventory[a.id] ? a.icon : mdiHelp" :size="30" /></span>
          <div>
            <small class="rarity">{{ RARITY[a.rarity].name }}</small>
            <strong>{{ hero.inventory[a.id] ? a.name : '???' }}</strong>
            <p>{{ hero.inventory[a.id] ? a.lore : 'Ще не знайдено' }}</p>
          </div>
          <b v-if="(hero.inventory[a.id] ?? 0) > 1" class="count">×{{ hero.inventory[a.id] }}</b>
        </div>
      </div>
    </section>

    <Transition name="pop">
      <div v-if="loot" class="overlay" @click.self="loot = null">
        <div class="panel ornate reveal" :style="{ '--rarity': RARITY[loot.item.rarity].color }" role="dialog" aria-modal="true">
          <div class="eyebrow">Скриня «{{ loot.mod.location }}»</div>
          <div class="loot-ico"><MdiIcon :path="loot.item.icon" :size="64" /></div>
          <small class="rarity">{{ RARITY[loot.item.rarity].name }} артефакт</small>
          <h2>{{ loot.item.name }}</h2>
          <p class="muted">{{ loot.item.lore }}</p>
          <span class="chip gold"><MdiIcon :path="mdiGold" :size="16" /> +{{ loot.gold }} золота</span>
          <button class="btn primary" @click="loot = null">Забрати</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
section { margin-bottom: 32px; }
.page-head p { max-width: 620px; }
.chip.gold { color: var(--gold); }
.section-title { font-size: 18px; margin-bottom: 14px; }
.chests { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.chest {
  display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center;
  padding: 18px 10px; border-radius: 16px;
  border: 1px solid var(--line); background: rgba(0, 3, 14, 0.35);
  color: var(--text-faint); cursor: default;
}
.chest strong { font-size: 13px; line-height: 1.3; }
.chest small { font-size: 12px; }
.chest.ready {
  color: var(--gold); border-color: rgba(240, 201, 135, 0.6); cursor: pointer;
  background: radial-gradient(circle at 50% 30%, rgba(240, 201, 135, 0.18), rgba(44, 27, 47, 0.5));
  animation: beckon 1.6s ease-in-out infinite;
}
.chest.ready strong { color: var(--mist); }
.chest.opened { color: var(--rose); }
.chest.opened strong { color: var(--text-dim); }
.chest.shaking { animation: rattle 0.15s linear infinite; }
@keyframes beckon { 50% { box-shadow: 0 0 30px rgba(240, 201, 135, 0.35); transform: translateY(-3px); } }
@keyframes rattle { 25% { transform: rotate(-4deg); } 75% { transform: rotate(4deg); } }
.artifacts { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.artifact { position: relative; display: flex; gap: 14px; align-items: flex-start; padding: 16px; opacity: 0.5; }
.artifact.owned { opacity: 1; border-color: color-mix(in srgb, var(--rarity) 50%, transparent); }
.a-ico { width: 54px; height: 54px; flex-shrink: 0; border-radius: 14px; display: grid; place-items: center; background: rgba(0, 3, 14, 0.5); color: var(--text-faint); }
.owned .a-ico { color: var(--rarity); box-shadow: inset 0 0 0 1px var(--rarity), 0 0 18px color-mix(in srgb, var(--rarity) 35%, transparent); }
.rarity { font-family: var(--font-head); font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--rarity); }
.artifact strong { display: block; font-size: 14px; margin: 2px 0 4px; }
.artifact p { margin: 0; font-size: 13px; color: var(--text-dim); line-height: 1.45; }
.count { position: absolute; top: 10px; right: 12px; font-size: 12px; color: var(--rarity); }
.overlay { position: fixed; inset: 0; z-index: 90; display: grid; place-items: center; padding: 16px; background: rgba(0, 3, 14, 0.8); backdrop-filter: blur(4px); }
.reveal { max-width: 400px; width: 100%; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 36px 28px; }
.reveal h2 { font-size: 22px; margin: 0; }
.reveal p { margin: 0; }
.loot-ico {
  width: 128px; height: 128px; border-radius: 50%; margin: 10px 0;
  display: grid; place-items: center; color: var(--abyss);
  background: radial-gradient(circle at 40% 35%, #fff, var(--rarity) 55%, var(--plum));
  box-shadow: 0 0 70px var(--rarity);
  animation: spin-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1.2);
}
@keyframes spin-in { from { transform: scale(0.2) rotate(-180deg); opacity: 0; } }
.pop-enter-active, .pop-leave-active { transition: opacity 0.25s; }
.pop-enter-from, .pop-leave-to { opacity: 0; }
</style>
