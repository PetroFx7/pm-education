import { shuffle } from '../lib/random'
import type { QuizQuestion } from './types'

export const PASS_RATIO = 0.8
export const HERO_HP = 2 // друга помилка — поразка (потрібно 4 з 5)

export const isVictory = (correct: number, total: number): boolean => total > 0 && correct / total >= PASS_RATIO

// Перемішуємо питання і варіанти, зберігаючи правильну відповідь
export function prepareQuiz(questions: readonly QuizQuestion[]): QuizQuestion[] {
  return shuffle(questions).map((q) => {
    const order = shuffle(q.o.map((_, i) => i))
    return { ...q, o: order.map((i) => q.o[i]), a: order.indexOf(q.a) }
  })
}
