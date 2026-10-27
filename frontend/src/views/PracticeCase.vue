<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mdiArrowLeft, mdiArrowRight, mdiCheckDecagram, mdiClockOutline } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import { moduleById, practice, practiceTitle, type PracticeKind } from '../services/course'
import { REWARDS } from '../data/world'
import { renderMarkdown } from '../lib/markdown'
import { useReadingProgress } from '../composables/useReadingProgress'
import { useHeroStore } from '../stores/hero'

const props = defineProps<{ kind: PracticeKind; lessonId: string }>()
const hero = useHeroStore()
const router = useRouter()

const list = computed(() => practice[props.kind])
const index = computed(() => list.value.findIndex((l) => l.id === props.lessonId))
const lesson = computed(() => list.value[index.value])
const mod = computed(() => (lesson.value ? moduleById(lesson.value.moduleId) : undefined))
const prev = computed(() => list.value[index.value - 1])
const next = computed(() => list.value[index.value + 1])
const html = computed(() => (lesson.value ? renderMarkdown(lesson.value.content) : ''))
const done = computed(() => !!(lesson.value && hero.lessons[lesson.value.id]))
const back = computed(() => `/practice/${props.kind}`)

const readPct = useReadingProgress()
onMounted(() => {
  if (!lesson.value) router.replace(back.value)
})

function complete() {
  hero.completeLesson(mod.value!, lesson.value)
  router.push(next.value ? `${back.value}/${next.value.id}` : back.value)
}
</script>

<template>
  <div v-if="lesson && mod" class="page case-page">
    <div class="read-bar"><span :style="{ width: readPct + '%' }" /></div>

    <RouterLink :to="back" class="back"><MdiIcon :path="mdiArrowLeft" :size="18" /> Практика</RouterLink>

    <article class="scroll panel ornate">
      <header class="scroll-head">
        <div class="eyebrow">{{ lesson.number }} · {{ mod.location }} · {{ index + 1 }} з {{ list.length }}</div>
        <h1>{{ practiceTitle(lesson) }}</h1>
        <div class="meta">
          <span class="chip"><MdiIcon :path="mdiClockOutline" :size="14" /> {{ lesson.minutes }} хв читання</span>
          <span class="chip" :class="{ ok: done }">
            <template v-if="done"><MdiIcon :path="mdiCheckDecagram" :size="14" /> Виконано</template>
            <template v-else>Нагорода: +{{ REWARDS.lesson.xp }} XP</template>
          </span>
        </div>
      </header>

      <div class="prose" v-html="html" />

      <footer class="scroll-foot">
        <button v-if="!done" class="btn primary" @click="complete">
          <MdiIcon :path="mdiCheckDecagram" :size="20" /> Розібрано
        </button>
        <RouterLink v-else-if="next" :to="`${back}/${next.id}`" class="btn primary">
          Наступна ситуація <MdiIcon :path="mdiArrowRight" :size="18" />
        </RouterLink>
        <RouterLink v-else :to="back" class="btn primary">До списку</RouterLink>
      </footer>
    </article>

    <nav class="pager">
      <RouterLink v-if="prev" :to="`${back}/${prev.id}`" class="pg">
        <MdiIcon :path="mdiArrowLeft" :size="18" />
        <span><small>Попередня</small>{{ practiceTitle(prev) }}</span>
      </RouterLink>
      <span v-else />
      <RouterLink v-if="next" :to="`${back}/${next.id}`" class="pg right">
        <span><small>Наступна</small>{{ practiceTitle(next) }}</span>
        <MdiIcon :path="mdiArrowRight" :size="18" />
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.case-page { max-width: 860px; }
.read-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 60; }
.read-bar span { display: block; height: 100%; background: linear-gradient(90deg, var(--plum), var(--rose)); box-shadow: 0 0 10px var(--rose); }
.back { display: inline-flex; align-items: center; gap: 6px; color: var(--text-dim); text-decoration: none; font-weight: 700; margin-bottom: 18px; }
.back:hover { color: var(--mist); }
.scroll { padding: 40px 48px; }
.scroll-head { padding-bottom: 22px; margin-bottom: 26px; border-bottom: 1px solid var(--line); }
.scroll-head h1 { font-size: clamp(22px, 3.4vw, 32px); margin: 8px 0 14px; }
.meta { display: flex; flex-wrap: wrap; gap: 8px; }
.chip.ok { color: var(--good); border-color: rgba(159, 214, 181, 0.4); }
.scroll-foot { margin-top: 36px; padding-top: 26px; border-top: 1px solid var(--line); display: flex; justify-content: center; }
.pager { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 20px; }
.pg {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: 14px;
  border: 1px solid var(--line); color: var(--text-dim); text-decoration: none;
  font-weight: 700; font-size: 14px; line-height: 1.35;
}
.pg small { display: block; font-size: 11px; color: var(--rose); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
.pg:hover { border-color: var(--rose); color: var(--mist); }
.pg.right { justify-content: flex-end; text-align: right; }
@media (max-width: 640px) {
  .scroll { padding: 24px 18px; }
  .pager { grid-template-columns: 1fr; }
}
</style>
