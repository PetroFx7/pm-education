import type { CourseModule, SkillId } from './types'

export const TITLES = [
  'Новачок з Таверни',
  'Підмайстер Планів',
  'Мандрівник Беклогів',
  'Хранитель Дедлайнів',
  'Ватажок Спринтів',
  'Лицар Стейкхолдерів',
  'Майстер Ризиків',
  'Архімаг Проєктів',
  'Легенда Гільдії',
]

export const CLASS_BONUS = 0.2

// Досвід, потрібний для досягнення рівня: 0, 120, 360, 720…
export const xpForLevel = (lvl: number): number => 60 * (lvl - 1) * lvl

export function levelFromXp(xp: number): number {
  let lvl = 1
  while (xp >= xpForLevel(lvl + 1)) lvl++
  return lvl
}

export function levelProgress(xp: number) {
  const lvl = levelFromXp(xp)
  const from = xpForLevel(lvl)
  const to = xpForLevel(lvl + 1)
  return { current: xp - from, needed: to - from, pct: ((xp - from) / (to - from)) * 100 }
}

export const titleForLevel = (lvl: number): string => TITLES[Math.min(lvl - 1, TITLES.length - 1)]

export const classBonus = (xp: number, mod: CourseModule | null, heroClass: SkillId): number =>
  mod && mod.skill === heroClass ? Math.round(xp * CLASS_BONUS) : 0
