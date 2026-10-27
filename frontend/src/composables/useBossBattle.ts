import { computed, ref, type Ref } from 'vue'
import { QUIZZES } from '../data/quizzes'
import { HERO_HP, prepareQuiz } from '../domain/quiz'
import { useHeroStore } from '../stores/hero'
import type { CourseModule, QuizQuestion } from '../domain/types'

export type BattlePhase = 'intro' | 'battle' | 'result'

// Стан бою з босом: черга питань, удари, здоров'я сторін і фінальний результат
export function useBossBattle(mod: Ref<CourseModule>) {
  const hero = useHeroStore()

  const phase = ref<BattlePhase>('intro')
  const questions = ref<QuizQuestion[]>([])
  const step = ref(0)
  const picked = ref<number | null>(null)
  const correct = ref(0)
  const wrong = ref(0)
  const hit = ref<'boss' | 'hero' | null>(null)
  const result = ref<{ defeated: boolean; firstWin: boolean } | null>(null)

  const current = computed(() => questions.value[step.value])
  const total = computed(() => questions.value.length)
  const bossHp = computed(() => total.value - correct.value)
  const heroHp = computed(() => Math.max(0, HERO_HP - wrong.value))
  const isLast = computed(() => step.value + 1 >= total.value)

  function start() {
    questions.value = prepareQuiz(QUIZZES[mod.value.id] ?? [])
    step.value = 0
    picked.value = null
    correct.value = 0
    wrong.value = 0
    result.value = null
    phase.value = 'battle'
  }

  function answer(i: number) {
    if (picked.value !== null) return
    picked.value = i
    const ok = i === current.value.a
    if (ok) correct.value++
    else wrong.value++
    hit.value = ok ? 'boss' : 'hero'
    setTimeout(() => (hit.value = null), 500)
  }

  function next() {
    if (isLast.value) {
      result.value = hero.finishBoss(mod.value, correct.value, total.value)
      phase.value = 'result'
      return
    }
    step.value++
    picked.value = null
  }

  return { phase, current, step, total, picked, correct, hit, result, bossHp, heroHp, isLast, start, answer, next }
}
