export interface AchievementContext {
  lessonsDone: number
  totalLessons: number
  bossesDefeated: number
  totalBosses: number
  reflectionsDone: number
  chestsOpened: number
  uniqueArtifacts: number
  regionCleared: boolean
  streak: number
  visited: number
  level: number
  glossarySeen: number
}

// Правила досягнень: id -> чи виконано умову
export function evaluateAchievements(c: AchievementContext): Record<string, boolean> {
  return {
    'first-quest': c.lessonsDone >= 1,
    scholar: c.lessonsDone >= 25,
    sage: c.lessonsDone >= c.totalLessons,
    'first-boss': c.bossesDefeated >= 1,
    journal: c.reflectionsDone >= 3,
    chest: c.chestsOpened >= 1,
    collector: c.uniqueArtifacts >= 7,
    region: c.regionCleared,
    'streak-3': c.streak >= 3,
    'streak-7': c.streak >= 7,
    explorer: c.visited >= 9,
    'level-5': c.level >= 5,
    legend: c.bossesDefeated >= c.totalBosses,
    glossary: c.glossarySeen >= 15,
  }
}
