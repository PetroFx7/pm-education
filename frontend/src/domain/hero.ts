import type { BossRecord, CourseModule, ModuleStats, ReflectionRecord, SkillId } from './types'

export interface HeroState {
  created: boolean
  name: string
  heroClass: SkillId
  avatar: string
  xp: number
  gold: number
  skills: Record<SkillId, number>
  lessons: Record<string, string> // lessonId -> дата завершення
  reflections: Record<number, ReflectionRecord>
  bosses: Record<number, BossRecord>
  chests: Record<number, 'opened'>
  inventory: Record<string, number> // artifactId -> кількість
  achievements: Record<string, string> // id -> дата
  visited: number[]
  glossarySeen: string[]
  days: string[]
  freeExplore: boolean
}

export const MIN_REFLECTION_LENGTH = 15

export const freshHero = (): HeroState => ({
  created: false,
  name: '',
  heroClass: 'planner',
  avatar: 'wizard',
  xp: 0,
  gold: 0,
  skills: { planner: 0, strategist: 0, communicator: 0 },
  lessons: {},
  reflections: {},
  bosses: {},
  chests: {},
  inventory: {},
  achievements: {},
  visited: [],
  glossarySeen: [],
  days: [],
  freeExplore: false,
})

// Режим перегляду (без входу): усе відкрито, прогрес не зберігається
export const guestHero = (): HeroState => ({ ...freshHero(), created: true, name: 'Гість', freeExplore: true })

export const emptyBoss = (): BossRecord => ({ best: 0, attempts: 0, defeated: false })

export function moduleStats(s: HeroState, mod: CourseModule): ModuleStats {
  const done = mod.lessons.filter((l) => s.lessons[l.id]).length
  const boss = s.bosses[mod.id] || emptyBoss()
  const lessonsComplete = done === mod.lessons.length
  const cleared = lessonsComplete && boss.defeated
  return {
    done,
    total: mod.lessons.length,
    pct: Math.round((done / mod.lessons.length) * 100),
    lessonsComplete,
    boss,
    cleared,
    chestReady: cleared && s.chests[mod.id] !== 'opened',
    chestOpened: s.chests[mod.id] === 'opened',
  }
}

export const isModuleUnlocked = (s: HeroState, id: number): boolean =>
  s.freeExplore || id === 1 || !!s.bosses[id - 1]?.defeated

export const isReflectionComplete = (answers: readonly string[]): boolean =>
  answers.every((a) => a.trim().length >= MIN_REFLECTION_LENGTH)
