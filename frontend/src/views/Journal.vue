<script setup lang="ts">
import { computed } from 'vue'
import { mdiFeather, mdiScriptTextOutline, mdiPencil } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import { modules } from '../services/course'
import { useHeroStore } from '../stores/hero'

const hero = useHeroStore()

const entries = computed(() =>
  modules
    .filter((m) => hero.reflections[m.id]?.answers.some((a) => a.trim()))
    .map((m) => ({ mod: m, record: hero.reflections[m.id] })),
)
</script>

<template>
  <div class="page narrow">
    <header class="page-head">
      <div class="eyebrow">Журнал мандрівника</div>
      <h1>Записи рефлексії</h1>
      <p class="muted">Твої відповіді на сувої «Перевір себе». Повертайся до них, коли сумніваєшся в рішенні на реальному проєкті.</p>
    </header>

    <div v-if="!entries.length" class="panel empty">
      <MdiIcon :path="mdiScriptTextOutline" :size="48" />
      <p>Журнал поки порожній. Сувої рефлексії чекають наприкінці кожної локації.</p>
      <RouterLink to="/map" class="btn primary">До мапи</RouterLink>
    </div>

    <article v-for="e in entries" :key="e.mod.id" class="panel entry">
      <header>
        <span class="ico"><MdiIcon :path="e.mod.icon" :size="22" /></span>
        <div>
          <div class="eyebrow">Модуль {{ e.mod.id }} · {{ e.mod.location }}</div>
          <h2>{{ e.mod.title }}</h2>
        </div>
        <span v-if="e.record.done" class="chip seal"><MdiIcon :path="mdiFeather" :size="14" /> Запечатано</span>
        <span v-else class="chip">Чернетка</span>
      </header>
      <dl>
        <template v-for="(q, i) in e.mod.reflection" :key="i">
          <dt>{{ q }}</dt>
          <dd>{{ e.record.answers[i]?.trim() || '—' }}</dd>
        </template>
      </dl>
      <RouterLink :to="`/location/${e.mod.id}/scroll`" class="btn small ghost"><MdiIcon :path="mdiPencil" :size="16" /> Редагувати</RouterLink>
    </article>
  </div>
</template>

<style scoped>
.narrow { max-width: 860px; }
.empty { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 48px 24px; color: var(--text-dim); }
.empty .mdi { color: var(--rose); }
.entry { margin-bottom: 16px; }
.entry header { display: flex; gap: 14px; align-items: center; margin-bottom: 16px; }
.entry header > div { flex: 1; min-width: 0; }
.entry h2 { font-size: 17px; margin: 2px 0 0; }
.ico { width: 44px; height: 44px; flex-shrink: 0; border-radius: 12px; display: grid; place-items: center; background: linear-gradient(135deg, var(--rose), var(--plum)); color: var(--abyss); }
.seal { color: var(--rose); border-color: var(--rose); }
dl { margin: 0 0 16px; }
dt { font-weight: 700; margin-top: 14px; }
dd { margin: 6px 0 0; padding: 10px 14px; border-left: 2px solid var(--plum); color: var(--text-dim); white-space: pre-wrap; font-style: italic; }
@media (max-width: 640px) {
  .entry header { flex-wrap: wrap; }
}
</style>
