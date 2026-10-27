<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  mdiArrowLeft, mdiCheckBold, mdiClockOutline, mdiScriptTextOutline, mdiSwordCross, mdiLock,
  mdiTreasureChest, mdiStarFourPoints, mdiFeather,
} from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import { moduleById } from '../services/course'
import { CLASSES, REWARDS } from '../data/world'
import { renderMarkdown } from '../lib/markdown'
import { useHeroStore } from '../stores/hero'

const props = defineProps<{ id: string }>()
const hero = useHeroStore()
const mod = computed(() => moduleById(props.id)!)
const stats = computed(() => hero.moduleStats(mod.value))
const intro = computed(() => (mod.value.intro ? renderMarkdown(mod.value.intro) : ''))
const reflectionDone = computed(() => hero.reflections[mod.value.id]?.done)
const bonus = computed(() => mod.value.skill === hero.heroClass)

onMounted(() => hero.visit(mod.value.id))
</script>

<template>
  <div class="page">
    <RouterLink to="/map" class="back"><MdiIcon :path="mdiArrowLeft" :size="18" /> До мапи</RouterLink>

    <header class="hero-banner panel ornate">
      <div class="emblem"><MdiIcon :path="mod.icon" :size="48" /></div>
      <div class="info">
        <div class="eyebrow">Модуль {{ mod.id }} · {{ mod.location }}</div>
        <h1>{{ mod.title }}</h1>
        <div class="chips">
          <span class="chip">{{ stats.done }} / {{ stats.total }} квестів</span>
          <span class="chip"><MdiIcon :path="CLASSES[mod.skill].icon" :size="16" /> {{ CLASSES[mod.skill].name }}</span>
          <span v-if="bonus" class="chip bonus"><MdiIcon :path="mdiStarFourPoints" :size="14" /> +20% XP класу</span>
        </div>
        <div class="bar"><span :style="{ width: stats.pct + '%' }" /></div>
      </div>
    </header>

    <div v-if="intro" class="prose intro" v-html="intro" />

    <section>
      <h2 class="section-title">Сувої квестів</h2>
      <ol class="quests">
        <li v-for="l in mod.lessons" :key="l.id">
          <RouterLink :to="`/location/${mod.id}/quest/${l.id}`" class="quest" :class="{ done: hero.lessons[l.id] }">
            <span class="num">
              <MdiIcon v-if="hero.lessons[l.id]" :path="mdiCheckBold" :size="18" />
              <template v-else>{{ l.number }}</template>
            </span>
            <span class="q-title">{{ l.title }}</span>
            <span class="q-meta">
              <MdiIcon :path="mdiClockOutline" :size="14" /> {{ l.minutes }} хв
              <b v-if="!hero.lessons[l.id]">+{{ REWARDS.lesson.xp }} XP</b>
            </span>
          </RouterLink>
        </li>
      </ol>
    </section>

    <section class="finale">
      <RouterLink v-if="mod.reflection.length" :to="`/location/${mod.id}/scroll`" class="card panel" :class="{ done: reflectionDone }">
        <MdiIcon :path="reflectionDone ? mdiFeather : mdiScriptTextOutline" :size="36" />
        <div>
          <div class="eyebrow">Сувій рефлексії</div>
          <h3>Перевір себе</h3>
          <p class="muted">{{ mod.reflection.length }} відкритих питання. Запиши відповіді у свій журнал.</p>
          <span class="chip">{{ reflectionDone ? 'Записано ✦' : `+${REWARDS.reflection.xp} XP` }}</span>
        </div>
      </RouterLink>

      <component
        :is="stats.lessonsComplete || stats.boss.attempts ? 'RouterLink' : 'div'"
        :to="`/location/${mod.id}/boss`"
        class="card panel boss"
        :class="{ locked: !stats.lessonsComplete && !stats.boss.attempts, done: stats.boss.defeated }"
      >
        <MdiIcon :path="stats.lessonsComplete || stats.boss.attempts ? mod.boss.icon : mdiLock" :size="36" />
        <div>
          <div class="eyebrow">Бос локації</div>
          <h3>{{ mod.boss.name }}</h3>
          <p v-if="!stats.lessonsComplete && !stats.boss.attempts" class="muted">Виконай усі квести, щоб викликати боса на бій.</p>
          <p v-else-if="stats.boss.defeated" class="muted">Переможений · рекорд {{ stats.boss.best }}/5</p>
          <p v-else class="muted">5 питань. Щоб перемогти, потрібно 4 правильні відповіді.</p>
          <span class="chip"><MdiIcon :path="mdiSwordCross" :size="14" /> {{ stats.boss.defeated ? 'Реванш' : 'До бою' }}</span>
        </div>
      </component>

      <RouterLink v-if="stats.chestReady" to="/treasury" class="card panel chest">
        <MdiIcon :path="mdiTreasureChest" :size="36" />
        <div>
          <div class="eyebrow">Нагорода</div>
          <h3>Скриня локації</h3>
          <p class="muted">Локацію пройдено! Відкрий скриню у Скарбниці.</p>
        </div>
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.back { display: inline-flex; align-items: center; gap: 6px; color: var(--text-dim); text-decoration: none; font-weight: 700; margin-bottom: 18px; }
.back:hover { color: var(--mist); }
.hero-banner { display: flex; gap: 24px; align-items: center; margin-bottom: 28px; }
.emblem {
  width: 96px; height: 96px; flex-shrink: 0; border-radius: 28px;
  display: grid; place-items: center;
  background: radial-gradient(circle at 35% 30%, var(--rose), var(--plum) 60%, var(--plum-deep));
  box-shadow: var(--glow);
  transform: rotate(-4deg);
}
.info { flex: 1; min-width: 0; }
.info h1 { font-size: clamp(22px, 3.4vw, 32px); margin: 6px 0 12px; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.chip.bonus { color: var(--rose); border-color: var(--rose); }
.intro { margin-bottom: 28px; }
.section-title { font-size: 18px; margin-bottom: 14px; }
.quests { list-style: none; padding: 0; margin: 0 0 36px; display: grid; gap: 10px; }
.quest {
  display: grid; grid-template-columns: 44px 1fr auto; gap: 14px; align-items: center;
  padding: 14px 18px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(44, 27, 47, 0.45);
  color: inherit; text-decoration: none;
  transition: all 0.2s;
}
.quest:hover { border-color: var(--rose); transform: translateX(4px); background: rgba(94, 58, 92, 0.4); }
.num {
  width: 44px; height: 44px; border-radius: 12px;
  display: grid; place-items: center;
  font-family: var(--font-head); font-size: 12px; font-weight: 700;
  border: 1px solid var(--line-strong); color: var(--rose);
}
.quest.done .num { background: var(--rose); color: var(--abyss); border-color: transparent; }
.quest.done .q-title { color: var(--text-dim); }
.q-title { font-weight: 700; }
.q-meta { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-faint); white-space: nowrap; }
.q-meta b { color: var(--rose); margin-left: 6px; }
.finale { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.card { display: flex; gap: 18px; align-items: flex-start; color: inherit; text-decoration: none; transition: all 0.2s; }
.card > .mdi { color: var(--rose); }
.card h3 { font-size: 18px; margin: 4px 0 6px; }
.card p { margin: 0 0 12px; font-size: 14px; }
a.card:hover { border-color: var(--rose); box-shadow: var(--glow); }
.card.boss:not(.locked) { border-color: rgba(232, 138, 154, 0.45); }
.card.boss:not(.locked) > .mdi { color: var(--bad); }
.card.locked { opacity: 0.55; }
.card.done > .mdi { color: var(--good); }
.card.chest { border-color: rgba(240, 201, 135, 0.6); }
.card.chest > .mdi { color: var(--gold); }
@media (max-width: 640px) {
  .hero-banner { flex-direction: column; align-items: flex-start; }
  .emblem { width: 72px; height: 72px; border-radius: 22px; }
  .quest { grid-template-columns: 40px 1fr; }
  .q-meta { grid-column: 2; }
  .num { width: 40px; height: 40px; }
}
</style>
