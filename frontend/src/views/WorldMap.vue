<script setup lang="ts">
import { useRouter } from 'vue-router'
import { mdiLock, mdiCheckBold, mdiArrowRight, mdiSwordCross, mdiScriptText, mdiTreasureChest, mdiStarFourPoints } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import HeroAvatar from '../components/HeroAvatar.vue'
import { modules, totalLessons } from '../services/course'
import { CLASSES } from '../data/world'
import { useHeroStore } from '../stores/hero'
import { useWorldMap, type MapNode } from '../composables/useWorldMap'

const hero = useHeroStore()
const router = useRouter()
const { layout, trail, trailDone, next } = useWorldMap()

function go(node: MapNode) {
  if (node.unlocked) router.push(`/location/${node.mod.id}`)
}
</script>

<template>
  <div class="page">
    <header class="hud panel ornate">
      <div class="hud-main">
        <div class="eyebrow">Мапа світу</div>
        <h1>Вітаємо, {{ hero.name }}!</h1>
        <p class="muted">
          Пройдено {{ hero.lessonsDone }} з {{ totalLessons }} квестів · переможено {{ hero.bossesDefeated }} з {{ modules.length }} босів
        </p>
        <div class="bar big"><span :style="{ width: hero.overallPct + '%' }" /></div>
      </div>
      <div v-if="next" class="next">
        <div class="eyebrow">Наступна ціль</div>
        <div class="next-title">
          <MdiIcon :path="next.kind === 'boss' ? mdiSwordCross : mdiScriptText" :size="20" />
          {{ next.label }}
        </div>
        <div class="muted small">{{ next.mod.location }}</div>
        <RouterLink :to="next.to" class="btn primary">
          {{ next.kind === 'boss' ? 'До бою' : 'Продовжити' }} <MdiIcon :path="mdiArrowRight" :size="18" />
        </RouterLink>
      </div>
      <div v-else class="next">
        <div class="eyebrow">Подорож завершено</div>
        <div class="next-title">Ти — легенда Гільдії ✦</div>
      </div>
    </header>

    <div v-if="hero.readyChests.length" class="chest-alert">
      <MdiIcon :path="mdiTreasureChest" :size="22" />
      <span>На тебе чекають скрині: {{ hero.readyChests.length }}</span>
      <RouterLink to="/treasury" class="btn small">Відкрити</RouterLink>
    </div>

    <div class="map" :style="{ height: layout.height + 'px' }">
      <div
        v-for="r in layout.regions"
        :key="r.id"
        class="region"
        :class="{ cleared: r.cleared }"
        :style="{ top: r.top + 'px', height: r.height + 'px' }"
      >
        <div class="banner">
          <span class="roman">Регіон {{ r.id }}</span>
          <h2>{{ r.name }}</h2>
          <span class="muted small">{{ r.desc }}</span>
        </div>
      </div>

      <svg class="trail" :viewBox="`0 0 1000 ${layout.height}`" preserveAspectRatio="none" aria-hidden="true">
        <path :d="trail" class="trail-base" vector-effect="non-scaling-stroke" />
        <path v-if="trailDone" :d="trailDone" class="trail-done" vector-effect="non-scaling-stroke" />
      </svg>

      <button
        v-for="n in layout.nodes"
        :key="n.mod.id"
        class="node"
        :class="[n.state, { current: n.current }]"
        :style="{ left: n.x + '%', top: n.y + 'px' }"
        :disabled="!n.unlocked"
        :aria-label="`${n.mod.location}: ${n.mod.title}`"
        @click="go(n)"
      >
        <span class="orb" :style="{ '--pct': n.stats.pct }">
          <MdiIcon :path="n.unlocked ? n.mod.icon : mdiLock" :size="30" />
          <span v-if="n.state === 'cleared'" class="tick"><MdiIcon :path="mdiCheckBold" :size="14" /></span>
          <span v-if="n.stats.chestReady" class="tick chest"><MdiIcon :path="mdiTreasureChest" :size="14" /></span>
          <span v-if="n.mod.skill === hero.heroClass && n.unlocked" class="perk" :title="`Бонус класу ${CLASSES[hero.heroClass].name}`">
            <MdiIcon :path="mdiStarFourPoints" :size="12" />
          </span>
        </span>
        <span v-if="n.current" class="me"><HeroAvatar :avatar="hero.avatar" :size="34" /></span>
        <span class="label">
          <small>Модуль {{ n.mod.id }}</small>
          <strong>{{ n.mod.location }}</strong>
          <em>{{ n.mod.title }}</em>
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.hud { display: grid; grid-template-columns: 1fr auto; gap: 28px; align-items: center; margin-bottom: 20px; }
.hud h1 { font-size: clamp(22px, 3.5vw, 32px); margin: 6px 0 4px; }
.hud p { margin: 0 0 14px; }
.bar.big { height: 12px; }
.next {
  min-width: 240px;
  padding: 18px;
  border-radius: 16px;
  border: 1px dashed var(--line-strong);
  background: rgba(0, 3, 14, 0.35);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.next-title { display: flex; gap: 8px; align-items: flex-start; font-weight: 800; line-height: 1.35; }
.next-title .mdi { color: var(--rose); margin-top: 2px; }
.next .btn { margin-top: 8px; align-self: flex-start; }
.small { font-size: 13px; }

.chest-alert {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 18px; margin-bottom: 20px;
  border-radius: 14px;
  border: 1px solid rgba(240, 201, 135, 0.5);
  background: rgba(240, 201, 135, 0.08);
  color: var(--gold);
  font-weight: 700;
}
.chest-alert .btn { margin-left: auto; }

.map { position: relative; margin-top: 12px; }

.region {
  position: absolute;
  left: 0;
  right: 0;
  border-radius: 40px;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(180, 122, 154, 0.14), transparent 60%),
    linear-gradient(180deg, rgba(44, 27, 47, 0.5), rgba(11, 14, 26, 0.2));
  border: 1px solid rgba(180, 122, 154, 0.12);
}
.region.cleared { border-color: rgba(180, 122, 154, 0.45); }
.banner { text-align: center; padding-top: 22px; }
.banner h2 { font-size: clamp(16px, 2.6vw, 22px); margin: 2px 0; }
.roman { font-family: var(--font-head); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--rose); }
.region.cleared .banner h2::after { content: ' ✦'; color: var(--rose); }

.trail { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.trail-base { fill: none; stroke: rgba(180, 122, 154, 0.35); stroke-width: 3; stroke-dasharray: 2 10; stroke-linecap: round; }
.trail-done { fill: none; stroke: var(--rose); stroke-width: 4; stroke-linecap: round; filter: drop-shadow(0 0 6px var(--rose)); }

.node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  width: 180px;
  z-index: 2;
}
.node:disabled { cursor: not-allowed; }
.orb {
  position: relative;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--mist);
  background:
    radial-gradient(circle at 35% 30%, rgba(243, 233, 236, 0.18), transparent 50%),
    radial-gradient(circle, var(--plum), var(--plum-deep));
  box-shadow: 0 0 0 3px var(--night), 0 10px 30px rgba(0, 3, 14, 0.7);
  transition: transform 0.2s, box-shadow 0.2s;
}
/* кільце прогресу */
.orb::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: conic-gradient(var(--rose) calc(var(--pct) * 1%), rgba(180, 122, 154, 0.18) 0);
  -webkit-mask: radial-gradient(circle, transparent 41px, #000 42px);
  mask: radial-gradient(circle, transparent 41px, #000 42px);
}
.node:not(:disabled):hover .orb { transform: scale(1.08); box-shadow: 0 0 0 3px var(--night), 0 0 36px rgba(180, 122, 154, 0.7); }
.node.locked .orb { color: var(--text-faint); background: radial-gradient(circle, #1a1220, var(--abyss)); }
.node.locked .label { opacity: 0.45; }
.node.open .orb, .node.current .orb { animation: glow 2.2s ease-in-out infinite; }
.node.cleared .orb { background: radial-gradient(circle at 35% 30%, #f3c4dc, var(--rose) 50%, var(--plum)); color: var(--abyss); }
@keyframes glow { 50% { box-shadow: 0 0 0 3px var(--night), 0 0 40px rgba(180, 122, 154, 0.85); } }

.tick {
  position: absolute; right: -4px; bottom: -4px;
  width: 26px; height: 26px; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--mist); color: var(--abyss);
  box-shadow: 0 0 0 3px var(--night);
}
.tick.chest { background: var(--gold); animation: bob 1.2s ease-in-out infinite; }
.perk {
  position: absolute; left: -4px; top: -4px;
  width: 22px; height: 22px; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--night); color: var(--rose);
  border: 1px solid var(--rose);
}
@keyframes bob { 50% { transform: translateY(-3px); } }

.me { position: absolute; top: -30px; right: 30px; animation: bob 1.6s ease-in-out infinite; }

.label { display: flex; flex-direction: column; align-items: center; text-align: center; line-height: 1.3; }
.label small { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--rose); font-family: var(--font-head); }
.label strong { font-family: var(--font-head); font-size: 14px; color: var(--mist); margin: 2px 0; }
.label em { font-style: normal; font-size: 12px; color: var(--text-dim); }

@media (max-width: 760px) {
  .hud { grid-template-columns: 1fr; }
  .next { min-width: 0; }
  .node { width: 150px; }
  .orb { width: 64px; height: 64px; }
  .orb::before { -webkit-mask: radial-gradient(circle, transparent 35px, #000 36px); mask: radial-gradient(circle, transparent 35px, #000 36px); }
  .label em { display: none; }
  .region { border-radius: 28px; }
}
</style>
