<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { mdiAccountGroup, mdiBriefcaseOutline, mdiCheckDecagram, mdiClockOutline } from '@mdi/js'
import MdiIcon from '../components/MdiIcon.vue'
import { moduleById, practice, practiceTitle, type PracticeKind } from '../services/course'
import { useHeroStore } from '../stores/hero'

const props = defineProps<{ kind: PracticeKind }>()
const hero = useHeroStore()

const TABS: { kind: PracticeKind; label: string; icon: string; title: string; desc: string }[] = [
  {
    kind: 'situations',
    label: 'Робочі ситуації',
    icon: mdiAccountGroup,
    title: 'Робочі ситуації',
    desc: 'Конфлікти, складні клієнти, зірвані строки й інциденти — з покроковими діями і готовими фразами.',
  },
  {
    kind: 'cases',
    label: 'Кейси з модулів',
    icon: mdiBriefcaseOutline,
    title: 'Кейси з практики',
    desc: 'Як теорія кожного модуля працює на реальному проєкті: типова помилка, правильні дії, висновок.',
  },
]

const index = computed(() => TABS.findIndex((t) => t.kind === props.kind))
const tab = computed(() => TABS[index.value])
const items = computed(() =>
  practice[props.kind].map((lesson) => ({ lesson, mod: moduleById(lesson.moduleId)!, done: !!hero.lessons[lesson.id] })),
)
const doneCount = computed(() => items.value.filter((i) => i.done).length)

// Напрямок анімації: вміст виїжджає в бік обраної вкладки
const direction = ref<'left' | 'right'>('left')
watch(index, (now, before) => (direction.value = now > before ? 'left' : 'right'))
</script>

<template>
  <div class="page">
    <div class="tabs" role="tablist" :style="{ '--i': index, '--n': TABS.length }">
      <span class="tab-slider" aria-hidden="true" />
      <RouterLink
        v-for="t in TABS"
        :key="t.kind"
        :to="`/practice/${t.kind}`"
        replace
        class="tab"
        :class="{ active: t.kind === kind }"
        role="tab"
        :aria-selected="t.kind === kind"
      >
        <MdiIcon :path="t.icon" :size="18" /> <span>{{ t.label }}</span>
      </RouterLink>
    </div>

    <Transition :name="`slide-${direction}`" mode="out-in">
      <section :key="kind" role="tabpanel">
        <header class="page-head">
          <div class="eyebrow">Практика</div>
          <h1>{{ tab.title }}</h1>
          <p class="muted">{{ tab.desc }} Пройдено {{ doneCount }} з {{ items.length }}.</p>
          <div class="bar"><span :style="{ width: (items.length ? (doneCount / items.length) * 100 : 0) + '%' }" /></div>
        </header>

        <div class="cards">
          <RouterLink
            v-for="i in items"
            :key="i.lesson.id"
            :to="`/practice/${kind}/${i.lesson.id}`"
            class="panel card"
            :class="{ done: i.done }"
          >
            <span class="num">{{ i.lesson.number }}</span>
            <div class="body">
              <h2>{{ practiceTitle(i.lesson) }}</h2>
              <div class="meta">
                <span v-if="kind === 'cases'" class="src"><MdiIcon :path="i.mod.icon" :size="14" /> {{ i.mod.location }}</span>
                <span><MdiIcon :path="mdiClockOutline" :size="14" /> {{ i.lesson.minutes }} хв</span>
              </div>
            </div>
            <MdiIcon v-if="i.done" :path="mdiCheckDecagram" :size="22" class="check" />
          </RouterLink>
        </div>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.page-head .bar { max-width: 360px; }

/* Сегментований перемикач із повзунком, що плавно переїжджає між вкладками */
.tabs {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--n), 1fr);
  width: min(100%, 460px);
  padding: 4px;
  margin-bottom: 24px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: rgba(0, 3, 14, 0.5);
}
.tab-slider {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / var(--n));
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(180, 122, 154, 0.45), rgba(94, 58, 92, 0.3));
  box-shadow: inset 0 0 0 1px var(--rose), 0 0 18px rgba(180, 122, 154, 0.25);
  transform: translateX(calc(var(--i) * 100%));
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.tab {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  color: var(--text-dim);
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  transition: color 0.25s;
}
.tab:hover { color: var(--mist); }
.tab.active { color: var(--mist); }
.tab:focus-visible { outline: 2px solid var(--rose); outline-offset: 2px; }

.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-left-enter-from, .slide-right-leave-to { opacity: 0; transform: translateX(24px); }
.slide-left-leave-to, .slide-right-enter-from { opacity: 0; transform: translateX(-24px); }

.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
.card {
  display: flex; align-items: flex-start; gap: 14px;
  color: inherit; text-decoration: none;
  transition: border-color 0.2s, transform 0.2s;
}
.card:hover { border-color: var(--rose); transform: translateY(-2px); }
.num {
  flex-shrink: 0; min-width: 48px; height: 32px; padding: 0 8px;
  display: grid; place-items: center; border-radius: 10px;
  background: linear-gradient(135deg, var(--rose), var(--plum)); color: var(--abyss);
  font-weight: 800; font-size: 13px;
}
.body { flex: 1; min-width: 0; }
.card h2 { font-size: 16px; line-height: 1.35; margin: 4px 0 8px; }
.meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: var(--text-dim); }
.meta span { display: inline-flex; align-items: center; gap: 4px; }
.check { color: var(--good); flex-shrink: 0; }
.card.done { border-color: rgba(159, 214, 181, 0.3); }

@media (max-width: 640px) {
  .cards { grid-template-columns: 1fr; }
  .tab { font-size: 13px; padding: 10px 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .tab-slider, .slide-left-enter-active, .slide-left-leave-active,
  .slide-right-enter-active, .slide-right-leave-active { transition: none; }
}
</style>
