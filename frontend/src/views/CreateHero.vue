<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mdiArrowRight } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import HeroAvatar from '../components/HeroAvatar.vue'
import { CLASSES, AVATARS } from '../data/world'
import { modules, totalLessons } from '../services/course'
import { useHeroStore } from '../stores/hero'
import type { SkillId } from '../domain/types'

const hero = useHeroStore()
const router = useRouter()

const name = ref('')
const heroClass = ref<SkillId>('planner')
const avatar = ref('wizard')
const canStart = computed(() => name.value.trim().length >= 2)

function start() {
  if (!canStart.value) return
  hero.createHero({ name: name.value.trim(), heroClass: heroClass.value, avatar: avatar.value })
  router.push('/map')
}
</script>

<template>
  <div class="create">
    <header class="intro">
      <div class="eyebrow">Хроніки Проєктного Менеджера</div>
      <h1>PM Quest</h1>
      <p class="muted">
        Перед тобою світ із {{ modules.length }} локацій, {{ totalLessons }} квестів і {{ modules.length }} босів.
        Пройди шлях від новачка з таверни до Архімага Проєктів.
      </p>
    </header>

    <form class="panel ornate form" @submit.prevent="start">
      <section>
        <label class="step" for="hero-name"><span>I</span> Як звати героя?</label>
        <input id="hero-name" v-model="name" class="input" maxlength="24" placeholder="Напр., Олена Дедлайнова" autocomplete="off" />
      </section>

      <section>
        <div class="step"><span>II</span> Обери клас</div>
        <div class="classes">
          <button
            v-for="c in CLASSES"
            :key="c.id"
            type="button"
            class="class-card"
            :class="{ active: heroClass === c.id }"
            :aria-pressed="heroClass === c.id"
            @click="heroClass = c.id"
          >
            <MdiIcon :path="c.icon" :size="36" />
            <strong>{{ c.name }}</strong>
            <small>{{ c.tagline }}</small>
            <em>{{ c.perk }}</em>
          </button>
        </div>
      </section>

      <section>
        <div class="step"><span>III</span> Обери аватар</div>
        <div class="avatars">
          <button
            v-for="a in AVATARS"
            :key="a.id"
            type="button"
            class="av"
            :class="{ active: avatar === a.id }"
            :title="a.name"
            :aria-label="a.name"
            @click="avatar = a.id"
          >
            <HeroAvatar :avatar="a.id" :size="52" />
          </button>
        </div>
      </section>

      <button class="btn primary big" type="submit" :disabled="!canStart">
        Вирушити в пригоду <MdiIcon :path="mdiArrowRight" :size="20" />
      </button>
    </form>
  </div>
</template>

<style scoped>
.create { max-width: 760px; margin: 0 auto; padding: 56px 16px 64px; }
.intro { text-align: center; margin-bottom: 36px; }
.intro h1 {
  font-size: clamp(40px, 9vw, 72px);
  font-weight: 800;
  margin: 8px 0 12px;
  background: linear-gradient(180deg, var(--mist), var(--rose));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 40px rgba(180, 122, 154, 0.3);
}
.intro p { max-width: 520px; margin: 0 auto; }
.form { display: flex; flex-direction: column; gap: 30px; padding: 32px; }
.step { display: flex; align-items: center; gap: 12px; font-family: var(--font-head); font-weight: 600; margin-bottom: 14px; font-size: 16px; }
.step span {
  width: 32px; height: 32px; border-radius: 50%;
  display: grid; place-items: center;
  border: 1px solid var(--rose); color: var(--rose); font-size: 12px;
}
.input {
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid var(--line-strong);
  background: rgba(0, 3, 14, 0.5);
  color: var(--mist);
  font: inherit;
  font-size: 17px;
}
.input:focus { outline: none; border-color: var(--rose); box-shadow: var(--glow); }
.classes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.class-card {
  display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center;
  padding: 20px 14px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(0, 3, 14, 0.35);
  cursor: pointer;
  color: var(--text-dim);
  transition: all 0.2s;
}
.class-card strong { font-family: var(--font-head); color: var(--mist); font-size: 15px; }
.class-card small { font-size: 13px; line-height: 1.4; }
.class-card em { font-style: normal; font-size: 12px; color: var(--rose); margin-top: 4px; }
.class-card:hover { border-color: var(--line-strong); }
.class-card.active {
  border-color: var(--rose);
  background: linear-gradient(160deg, rgba(180, 122, 154, 0.25), rgba(44, 27, 47, 0.4));
  color: var(--mist);
  box-shadow: var(--glow);
}
.avatars { display: flex; flex-wrap: wrap; gap: 14px; }
.av { padding: 6px; border-radius: 50%; border: 2px solid transparent; background: none; cursor: pointer; opacity: 0.55; transition: all 0.2s; }
.av:hover { opacity: 0.9; }
.av.active { opacity: 1; border-color: var(--mist); transform: scale(1.06); }
.big { align-self: center; padding: 16px 32px; font-size: 16px; }
@media (max-width: 640px) {
  .create { padding-top: 32px; }
  .form { padding: 22px 18px; }
  .classes { grid-template-columns: 1fr; }
  .class-card { flex-direction: row; text-align: left; flex-wrap: wrap; column-gap: 12px; }
  .class-card small, .class-card em { flex-basis: 100%; }
}
</style>
