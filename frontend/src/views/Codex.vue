<script setup lang="ts">
import { computed, ref } from 'vue'
import { mdiMagnify, mdiCheckDecagram } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import { glossary } from '../services/course'
import { useHeroStore } from '../stores/hero'

const hero = useHeroStore()
const query = ref('')
const flipped = ref<Set<string>>(new Set())

const terms = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return glossary
  return glossary.filter((t) => `${t.abbr} ${t.full} ${t.meaning}`.toLowerCase().includes(q))
})

function flip(abbr: string) {
  const next = new Set(flipped.value)
  if (next.has(abbr)) next.delete(abbr)
  else {
    next.add(abbr)
    hero.seeTerm(abbr)
  }
  flipped.value = next
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div class="eyebrow">Кодекс гільдії</div>
      <h1>Руни скорочень</h1>
      <p class="muted">Торкнись руни, щоб розгадати її значення. Вивчено {{ hero.glossarySeen.length }} з {{ glossary.length }}.</p>
      <div class="bar"><span :style="{ width: (hero.glossarySeen.length / glossary.length) * 100 + '%' }" /></div>
    </header>

    <label class="search">
      <MdiIcon :path="mdiMagnify" :size="20" />
      <input v-model="query" type="search" placeholder="Пошук: CPI, ризик, бюджет…" aria-label="Пошук термінів" />
    </label>

    <div class="runes">
      <button
        v-for="t in terms"
        :key="t.abbr"
        class="rune"
        :class="{ open: flipped.has(t.abbr), known: hero.glossarySeen.includes(t.abbr) }"
        :aria-expanded="flipped.has(t.abbr)"
        @click="flip(t.abbr)"
      >
        <span class="front">
          <MdiIcon v-if="hero.glossarySeen.includes(t.abbr)" :path="mdiCheckDecagram" :size="16" class="known-mark" />
          <b>{{ t.abbr }}</b>
        </span>
        <span class="back">
          <strong>{{ t.full }}</strong>
          <small>{{ t.meaning }}</small>
        </span>
      </button>
    </div>
    <p v-if="!terms.length" class="muted">Такої руни в Кодексі немає.</p>
  </div>
</template>

<style scoped>
.page-head .bar { max-width: 360px; }
.search {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; margin-bottom: 22px; max-width: 460px;
  border-radius: 14px; border: 1px solid var(--line-strong); background: rgba(0, 3, 14, 0.5);
  color: var(--text-dim);
}
.search:focus-within { border-color: var(--rose); box-shadow: var(--glow); }
.search input { flex: 1; min-width: 0; background: none; border: 0; outline: none; color: var(--mist); font: inherit; }
.runes { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.rune {
  position: relative; min-height: 140px; padding: 0;
  border: 1px solid var(--line); border-radius: 16px;
  background: linear-gradient(160deg, rgba(44, 27, 47, 0.7), rgba(11, 14, 26, 0.7));
  cursor: pointer; perspective: 800px; overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.rune:hover { border-color: var(--rose); box-shadow: var(--glow); }
.rune.known { border-color: var(--line-strong); }
.front, .back { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 16px; transition: opacity 0.3s, transform 0.3s; }
.front b { font-family: var(--font-head); font-size: 26px; font-weight: 800; letter-spacing: 0.06em; background: linear-gradient(180deg, var(--mist), var(--rose)); -webkit-background-clip: text; background-clip: text; color: transparent; text-align: center; }
.known-mark { position: absolute; top: 10px; right: 10px; color: var(--rose); }
.back { opacity: 0; transform: translateY(12px); text-align: center; gap: 6px; }
.back strong { font-size: 14px; color: var(--rose); }
.back small { font-size: 13px; color: var(--text-dim); line-height: 1.4; }
.rune.open .front { opacity: 0; transform: translateY(-12px); }
.rune.open .back { opacity: 1; transform: none; }
</style>
