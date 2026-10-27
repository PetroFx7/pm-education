<script setup lang="ts">
import { computed, ref } from 'vue'
import { mdiArrowLeft, mdiFeather, mdiContentSave } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import { moduleById } from '../services/course'
import { REWARDS } from '../data/world'
import { useHeroStore } from '../stores/hero'

const props = defineProps<{ id: string }>()
const hero = useHeroStore()
const mod = computed(() => moduleById(props.id)!)
const saved = hero.reflections[mod.value.id]
const answers = ref<string[]>(mod.value.reflection.map((_, i) => saved?.answers[i] ?? ''))
const message = ref('')
const done = computed(() => !!hero.reflections[mod.value.id]?.done)
const allFilled = computed(() => answers.value.every((a) => a.trim().length >= 15))

function save() {
  const ok = hero.saveReflection(mod.value, [...answers.value])
  message.value = ok ? 'Сувій збережено в журналі ✦' : 'Чернетку збережено. Дай розгорнуту відповідь (від 15 символів) на кожне питання, щоб отримати нагороду.'
}
</script>

<template>
  <div class="page narrow">
    <RouterLink :to="`/location/${mod.id}`" class="back"><MdiIcon :path="mdiArrowLeft" :size="18" /> {{ mod.location }}</RouterLink>

    <header class="page-head">
      <div class="eyebrow">Сувій рефлексії · Модуль {{ mod.id }}</div>
      <h1>Перевір себе</h1>
      <p class="muted">
        Тут немає правильних варіантів, лише твоє розуміння. Відповідай своїми словами і спирайся на приклади з досвіду.
        <template v-if="!done">Нагорода: +{{ REWARDS.reflection.xp }} XP.</template>
      </p>
    </header>

    <form class="grid" @submit.prevent="save">
      <label v-for="(q, i) in mod.reflection" :key="i" class="panel item">
        <span class="q"><b>{{ i + 1 }}</b>{{ q }}</span>
        <textarea v-model="answers[i]" rows="4" placeholder="Твоя відповідь…" />
        <small :class="{ ok: answers[i].trim().length >= 15 }">{{ answers[i].trim().length }} симв.</small>
      </label>

      <div class="actions">
        <button class="btn primary" type="submit">
          <MdiIcon :path="done || allFilled ? mdiFeather : mdiContentSave" :size="18" />
          {{ done ? 'Оновити записи' : allFilled ? 'Запечатати сувій' : 'Зберегти чернетку' }}
        </button>
        <RouterLink to="/journal" class="btn ghost">Відкрити журнал</RouterLink>
      </div>
      <p v-if="message" class="msg" role="status">{{ message }}</p>
    </form>
  </div>
</template>

<style scoped>
.narrow { max-width: 820px; }
.back { display: inline-flex; align-items: center; gap: 6px; color: var(--text-dim); text-decoration: none; font-weight: 700; margin-bottom: 18px; }
.item { display: flex; flex-direction: column; gap: 12px; }
.q { display: flex; gap: 12px; font-weight: 700; line-height: 1.45; }
.q b {
  flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
  display: grid; place-items: center;
  border: 1px solid var(--rose); color: var(--rose);
  font-family: var(--font-head); font-size: 12px;
}
textarea {
  width: 100%; resize: vertical;
  padding: 14px 16px; border-radius: 12px;
  border: 1px solid var(--line-strong);
  background: rgba(0, 3, 14, 0.5);
  color: var(--mist); font: inherit; line-height: 1.6;
}
textarea:focus { outline: none; border-color: var(--rose); box-shadow: var(--glow); }
small { align-self: flex-end; color: var(--text-faint); font-size: 12px; }
small.ok { color: var(--good); }
.actions { display: flex; flex-wrap: wrap; gap: 12px; }
.msg { color: var(--rose); font-weight: 600; margin: 0; }
</style>
