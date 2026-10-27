import { defineStore } from 'pinia'
import type { Achievement } from '../domain/types'
import type { PracticeKind } from '../services/course'

export interface Toast {
  id: number
  kind: 'reward' | 'achievement' | 'info'
  title: string
  xp?: number
  gold?: number
  bonus?: number
  desc?: string
  icon?: string
}

let uid = 0

export const useUiStore = defineStore('ui', {
  state: () => ({
    toasts: [] as Toast[],
    levelUpInfo: null as { level: number; title: string } | null,
    practiceKind: 'situations' as PracticeKind, // остання обрана вкладка практики
  }),
  actions: {
    push(toast: Omit<Toast, 'id'>) {
      const id = ++uid
      this.toasts.push({ id, ...toast })
      setTimeout(() => this.dismiss(id), 3800)
    },
    toast({ title, xp, gold, bonus }: { title: string; xp: number; gold: number; bonus: number }) {
      this.push({ kind: 'reward', title, xp, gold, bonus })
    },
    info(title: string, desc: string) {
      this.push({ kind: 'info', title, desc })
    },
    achievement(a: Achievement) {
      this.push({ kind: 'achievement', title: a.name, desc: a.desc, icon: a.icon })
    },
    dismiss(id: number) {
      this.toasts = this.toasts.filter((t) => t.id !== id)
    },
    levelUp(level: number, title: string) {
      this.levelUpInfo = { level, title }
    },
  },
})
