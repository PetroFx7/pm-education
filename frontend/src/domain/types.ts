export type SkillId = 'planner' | 'strategist' | 'communicator'
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface HeroClass {
  id: SkillId
  name: string
  tagline: string
  icon: string
  color: string
  perk: string
}

export interface Avatar {
  id: string
  icon: string
  name: string
}

export interface Region {
  id: number
  name: string
  desc: string
  modules: number[]
}

export interface ModuleMeta {
  location: string
  icon: string
  skill: SkillId
  boss: { name: string; icon: string }
}

export interface Lesson {
  id: string
  moduleId: number
  number: string
  title: string
  content: string
  minutes: number
}

export interface CourseModule extends ModuleMeta {
  id: number
  title: string
  intro: string
  lessons: Lesson[]
  reflection: string[]
}

export interface GlossaryTerm {
  abbr: string
  full: string
  meaning: string
}

export interface Artifact {
  id: string
  name: string
  icon: string
  rarity: Rarity
  lore: string
}

export interface Achievement {
  id: string
  name: string
  desc: string
  icon: string
}

export interface QuizQuestion {
  q: string
  o: string[]
  a: number
  why: string
}

export interface Reward {
  xp: number
  gold: number
}

export interface BossRecord {
  best: number
  attempts: number
  defeated: boolean
}

export interface ReflectionRecord {
  answers: string[]
  done: boolean
}

export interface ModuleStats {
  done: number
  total: number
  pct: number
  lessonsComplete: boolean
  boss: BossRecord
  cleared: boolean
  chestReady: boolean
  chestOpened: boolean
}

export interface NextStep {
  mod: CourseModule
  label: string
  kind: 'quest' | 'boss'
  to: string
}
