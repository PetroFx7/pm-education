import { defineStore } from 'pinia'
import { modules, moduleById, totalLessons } from '../services/course'
import { REGIONS, REWARDS, ARTIFACTS, ACHIEVEMENTS, CLASSES } from '../data/world'
import { freshHero, guestHero, moduleStats, isModuleUnlocked, isReflectionComplete, emptyBoss, type HeroState } from '../domain/hero'
import { levelFromXp, levelProgress, titleForLevel, classBonus } from '../domain/progression'
import { calcStreak } from '../domain/streak'
import { isVictory } from '../domain/quiz'
import { rollChest } from '../domain/loot'
import { evaluateAchievements } from '../domain/achievements'
import { today } from '../lib/date'
import { useUiStore } from './ui'
import type { CourseModule, Lesson, ModuleStats, Reward, SkillId } from '../domain/types'

// Стан стартує як гість (режим перегляду); прогрес акаунта підставляє sync-стор
export const useHeroStore = defineStore('hero', {
  state: (): HeroState => guestHero(),

  getters: {
    level: (s): number => levelFromXp(s.xp),
    levelProgress: (s) => levelProgress(s.xp),
    title(): string {
      return titleForLevel(this.level)
    },
    classInfo: (s) => CLASSES[s.heroClass],
    lessonsDone: (s): number => Object.keys(s.lessons).length,
    bossesDefeated: (s): number => Object.values(s.bosses).filter((b) => b.defeated).length,
    overallPct(): number {
      return Math.round((this.lessonsDone / totalLessons) * 100)
    },
    streak: (s): number => calcStreak(s.days),
    moduleStats: (s) => (mod: CourseModule): ModuleStats => moduleStats(s, mod),
    isUnlocked: (s) => (id: number): boolean => isModuleUnlocked(s, id),
    readyChests(): CourseModule[] {
      return modules.filter((m) => this.moduleStats(m).chestReady)
    },
  },

  actions: {
    createHero({ name, heroClass, avatar }: { name: string; heroClass: SkillId; avatar: string }) {
      Object.assign(this, { name, heroClass, avatar, created: true })
      this.markDay()
    },

    markDay() {
      if (!this.days.includes(today())) this.days.push(today())
    },

    visit(id: number) {
      if (!this.visited.includes(id)) this.visited.push(id)
      this.checkAchievements()
    },

    // Нарахування досвіду з бонусом класу
    grant({ xp = 0, gold = 0 }: Partial<Reward>, mod: CourseModule | null, reason: string) {
      const bonus = classBonus(xp, mod, this.heroClass)
      const levelBefore = this.level
      this.xp += xp + bonus
      this.gold += gold
      if (mod) this.skills[mod.skill] += xp + bonus
      this.markDay()
      const ui = useUiStore()
      ui.toast({ title: reason, xp: xp + bonus, gold, bonus })
      if (this.level > levelBefore) ui.levelUp(this.level, this.title)
      this.checkAchievements()
    },

    completeLesson(mod: CourseModule, lesson: Lesson) {
      if (this.lessons[lesson.id]) return
      this.lessons[lesson.id] = today()
      this.grant(REWARDS.lesson, mod, `Квест «${lesson.title}» виконано`)
    },

    saveReflection(mod: CourseModule, answers: string[]): boolean {
      const prev = this.reflections[mod.id]
      const done = isReflectionComplete(answers)
      this.reflections[mod.id] = { answers, done: prev?.done || done }
      if (done && !prev?.done) this.grant(REWARDS.reflection, mod, 'Сувій рефлексії записано')
      return done
    },

    finishBoss(mod: CourseModule, correct: number, total: number): { defeated: boolean; firstWin: boolean } {
      const rec = this.bosses[mod.id] || emptyBoss()
      const defeated = isVictory(correct, total)
      const firstWin = defeated && !rec.defeated
      // нагорода лише за покращення найкращого результату
      const gain = Math.max(0, correct - rec.best)
      this.bosses[mod.id] = {
        best: Math.max(rec.best, correct),
        attempts: rec.attempts + 1,
        defeated: rec.defeated || defeated,
      }
      if (gain > 0) {
        const r: Reward = {
          xp: gain * REWARDS.bossPerAnswer.xp,
          gold: gain * REWARDS.bossPerAnswer.gold,
        }
        if (correct === total) {
          r.xp += REWARDS.bossPerfect.xp
          r.gold += REWARDS.bossPerfect.gold
          this.unlock('flawless')
        }
        this.grant(r, mod, firstWin ? `${mod.boss.name} переможений!` : 'Новий рекорд у бою')
      } else {
        this.markDay()
        this.checkAchievements()
      }
      return { defeated, firstWin }
    },

    openChest(mod: CourseModule) {
      if (!this.moduleStats(mod).chestReady) return null
      this.chests[mod.id] = 'opened'
      const loot = rollChest(ARTIFACTS)
      this.inventory[loot.item.id] = (this.inventory[loot.item.id] || 0) + 1
      this.gold += loot.gold
      this.checkAchievements()
      return loot
    },

    seeTerm(abbr: string) {
      if (!this.glossarySeen.includes(abbr)) {
        this.glossarySeen.push(abbr)
        this.checkAchievements()
      }
    },

    unlock(id: string) {
      if (this.achievements[id]) return
      const a = ACHIEVEMENTS.find((x) => x.id === id)
      if (!a) return
      this.achievements[id] = today()
      useUiStore().achievement(a)
    },

    checkAchievements() {
      const rules = evaluateAchievements({
        lessonsDone: this.lessonsDone,
        totalLessons,
        bossesDefeated: this.bossesDefeated,
        totalBosses: modules.length,
        reflectionsDone: Object.values(this.reflections).filter((r) => r.done).length,
        chestsOpened: Object.keys(this.chests).length,
        uniqueArtifacts: Object.keys(this.inventory).length,
        regionCleared: REGIONS.some((r) => r.modules.every((id) => this.moduleStats(moduleById(id)!).cleared)),
        streak: this.streak,
        visited: this.visited.length,
        level: this.level,
        glossarySeen: this.glossarySeen.length,
      })
      for (const [id, ok] of Object.entries(rules)) if (ok) this.unlock(id)
    },

    resetProgress() {
      this.$patch((s) => Object.assign(s, freshHero()))
    },
  },
})
