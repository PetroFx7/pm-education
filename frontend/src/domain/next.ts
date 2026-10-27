import type { CourseModule, ModuleStats, NextStep } from './types'

interface Progress {
  isUnlocked: (id: number) => boolean
  moduleStats: (mod: CourseModule) => ModuleStats
  lessons: Record<string, string>
}

// Наступний крок пригоди: перший незавершений квест або бос у відкритій локації
export function nextStep(modules: readonly CourseModule[], p: Progress): NextStep | null {
  for (const mod of modules) {
    if (!p.isUnlocked(mod.id)) break
    if (p.moduleStats(mod).cleared) continue
    const lesson = mod.lessons.find((l) => !p.lessons[l.id])
    if (lesson) return { mod, label: lesson.title, kind: 'quest', to: `/location/${mod.id}/quest/${lesson.id}` }
    return { mod, label: mod.boss.name, kind: 'boss', to: `/location/${mod.id}/boss` }
  }
  return null
}
