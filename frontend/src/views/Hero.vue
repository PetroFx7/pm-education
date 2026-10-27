<script setup lang="ts">
import { computed, ref } from 'vue'
import { mdiGold, mdiFire, mdiBookOpenVariant, mdiSwordCross, mdiLock, mdiMapMarkerRadius, mdiCompassRose, mdiDeleteForever } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import HeroAvatar from '../components/HeroAvatar.vue'
import { CLASSES, ACHIEVEMENTS } from '../data/world'
import { modules, totalLessons } from '../services/course'
import { useHeroStore } from '../stores/hero'
import { useAuthStore } from '../stores/auth'
import type { SkillId } from '../domain/types'

const hero = useHeroStore()
const auth = useAuthStore()

const maxSkill = computed(() => Math.max(100, ...Object.values(hero.skills)))
const skills = computed(() =>
  (Object.keys(CLASSES) as SkillId[]).map((id) => ({
    ...CLASSES[id],
    xp: hero.skills[id],
    modules: modules.filter((m) => m.skill === id).length,
  })),
)
const unlocked = computed(() => ACHIEVEMENTS.filter((a) => hero.achievements[a.id]).length)

const stats = computed(() => [
  { icon: mdiBookOpenVariant, label: 'Квестів', value: `${hero.lessonsDone}/${totalLessons}` },
  { icon: mdiSwordCross, label: 'Босів', value: `${hero.bossesDefeated}/${modules.length}` },
  { icon: mdiFire, label: 'Днів поспіль', value: hero.streak },
  { icon: mdiGold, label: 'Золота', value: hero.gold },
  { icon: mdiMapMarkerRadius, label: 'Локацій', value: `${hero.visited.length}/${modules.length}` },
])

const confirmReset = ref(false)
function reset() {
  if (!confirmReset.value) {
    confirmReset.value = true
    return
  }
  hero.resetProgress()
  location.hash = '#/create'
}
</script>

<template>
  <div class="page">
    <section class="panel ornate card">
      <HeroAvatar :avatar="hero.avatar" :level="hero.level" :size="112" />
      <div class="who">
        <div class="eyebrow">{{ hero.classInfo.name }}</div>
        <h1>{{ hero.name }}</h1>
        <p class="title">{{ hero.title }}</p>
        <div class="xp-row muted">
          <span>Рівень {{ hero.level }}</span>
          <span>{{ hero.levelProgress.current }} / {{ hero.levelProgress.needed }} XP до наступного</span>
        </div>
        <div class="bar"><span :style="{ width: hero.levelProgress.pct + '%' }" /></div>
        <p class="muted small">Усього досвіду: {{ hero.xp }} XP · {{ hero.classInfo.perk }}</p>
      </div>
    </section>

    <section class="stats">
      <div v-for="s in stats" :key="s.label" class="stat panel">
        <MdiIcon :path="s.icon" :size="22" />
        <b>{{ s.value }}</b>
        <span>{{ s.label }}</span>
      </div>
    </section>

    <section>
      <h2 class="section-title">Гілки навичок</h2>
      <div class="skills">
        <div v-for="s in skills" :key="s.id" class="panel skill" :class="{ main: s.id === hero.heroClass }">
          <div class="skill-head">
            <span class="skill-ico"><MdiIcon :path="s.icon" :size="26" /></span>
            <div>
              <strong>{{ s.name }}</strong>
              <small>{{ s.modules }} локацій · {{ s.tagline }}</small>
            </div>
          </div>
          <div class="bar"><span :style="{ width: (s.xp / maxSkill) * 100 + '%' }" /></div>
          <div class="skill-xp">{{ s.xp }} XP <em v-if="s.id === hero.heroClass">· основний клас</em></div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="section-title">Досягнення <span class="muted">{{ unlocked }}/{{ ACHIEVEMENTS.length }}</span></h2>
      <div class="achievements">
        <div v-for="a in ACHIEVEMENTS" :key="a.id" class="ach" :class="{ got: hero.achievements[a.id] }">
          <span class="ach-ico"><MdiIcon :path="hero.achievements[a.id] ? a.icon : mdiLock" :size="26" /></span>
          <strong>{{ a.name }}</strong>
          <small>{{ a.desc }}</small>
        </div>
      </div>
    </section>

    <section v-if="auth.user" class="panel settings">
      <h2 class="section-title">Налаштування пригоди</h2>
      <label class="toggle">
        <input v-model="hero.freeExplore" type="checkbox" />
        <span class="track"><span /></span>
        <span>
          <strong><MdiIcon :path="mdiCompassRose" :size="18" /> Вільне дослідження</strong>
          <small class="muted">Відкрити всі локації одразу, без перемоги над попереднім босом.</small>
        </span>
      </label>
      <button class="btn ghost danger" @click="reset">
        <MdiIcon :path="mdiDeleteForever" :size="18" />
        {{ confirmReset ? 'Точно? Натисни ще раз — прогрес зникне' : 'Почати з нуля' }}
      </button>
    </section>
  </div>
</template>

<style scoped>
section { margin-bottom: 28px; }
.card { display: flex; gap: 32px; align-items: center; }
.who { flex: 1; min-width: 0; }
.who h1 { font-size: clamp(26px, 4vw, 38px); margin: 4px 0 2px; }
.title { margin: 0 0 16px; color: var(--rose); font-weight: 700; }
.xp-row { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; margin-bottom: 6px; flex-wrap: wrap; }
.small { font-size: 13px; margin: 10px 0 0; }
.section-title { font-size: 18px; margin-bottom: 14px; }
.stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.stat { padding: 16px; display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.stat .mdi { color: var(--rose); }
.stat b { font-family: var(--font-head); font-size: 20px; }
.stat span { font-size: 12px; color: var(--text-dim); }
.skills { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.skill { padding: 18px; display: flex; flex-direction: column; gap: 12px; }
.skill.main { border-color: var(--rose); box-shadow: var(--glow); }
.skill-head { display: flex; gap: 12px; align-items: center; }
.skill-head strong { font-family: var(--font-head); display: block; font-size: 15px; }
.skill-head small { color: var(--text-dim); font-size: 12px; line-height: 1.35; display: block; }
.skill-ico { width: 46px; height: 46px; flex-shrink: 0; border-radius: 14px; display: grid; place-items: center; background: linear-gradient(135deg, var(--rose), var(--plum)); color: var(--abyss); }
.skill-xp { font-size: 13px; font-weight: 700; }
.skill-xp em { font-style: normal; color: var(--rose); }
.achievements { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 12px; }
.ach {
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;
  padding: 18px 12px; border-radius: 16px;
  border: 1px dashed var(--line);
  color: var(--text-faint);
}
.ach strong { font-size: 14px; }
.ach small { font-size: 12px; line-height: 1.4; }
.ach-ico { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; background: rgba(0, 3, 14, 0.5); }
.ach.got { border-style: solid; border-color: var(--line-strong); background: rgba(44, 27, 47, 0.5); color: var(--mist); }
.ach.got small { color: var(--text-dim); }
.ach.got .ach-ico { background: radial-gradient(circle at 35% 30%, var(--gold), var(--rose) 60%, var(--plum)); color: var(--abyss); box-shadow: var(--glow); }
.settings { display: flex; flex-direction: column; gap: 18px; align-items: flex-start; }
.toggle { display: flex; gap: 14px; align-items: flex-start; cursor: pointer; }
.toggle input { position: absolute; opacity: 0; }
.toggle strong { display: flex; align-items: center; gap: 6px; }
.toggle small { display: block; font-size: 13px; }
.track { flex-shrink: 0; width: 46px; height: 26px; border-radius: 13px; background: rgba(0, 3, 14, 0.6); border: 1px solid var(--line-strong); position: relative; transition: background 0.2s; margin-top: 2px; }
.track span { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: var(--text-dim); transition: all 0.2s; }
.toggle input:checked + .track { background: var(--rose); }
.toggle input:checked + .track span { left: 23px; background: var(--abyss); }
.toggle input:focus-visible + .track { outline: 2px solid var(--rose); outline-offset: 2px; }
.danger { color: var(--bad); border-color: rgba(232, 138, 154, 0.4); }
@media (max-width: 900px) {
  .stats { grid-template-columns: repeat(3, 1fr); }
  .skills { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .card { flex-direction: column; text-align: center; gap: 18px; }
  .xp-row { justify-content: center; }
  .stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
