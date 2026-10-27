import { computed } from 'vue'
import { moduleById } from '../services/course'
import { REGIONS } from '../data/world'
import { useHeroStore } from '../stores/hero'
import { useNextStep } from './useNextStep'
import type { CourseModule, ModuleStats, Region } from '../domain/types'

export interface MapNode {
  mod: CourseModule
  stats: ModuleStats
  unlocked: boolean
  x: number // у відсотках ширини
  y: number // у пікселях
  current: boolean
  state: 'locked' | 'open' | 'progress' | 'cleared'
}

export interface MapRegion extends Region {
  top: number
  height: number
  cleared: boolean
}

const STEP = 150
const BANNER = 110
const XS = [50, 74, 50, 26]

// Плавна крива через точки (x у відсотках → координати viewBox 0..1000)
function curve(points: { x: number; y: number }[]): string {
  if (!points.length) return ''
  const pts = points.map((p) => [p.x * 10, p.y])
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let k = 1; k < pts.length; k++) {
    const [x0, y0] = pts[k - 1]
    const [x1, y1] = pts[k]
    const my = (y0 + y1) / 2
    d += ` C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1}`
  }
  return d
}

// Розкладка мапи: банери регіонів і вузли-локації на звивистій стежці
export function useWorldMap() {
  const hero = useHeroStore()
  const next = useNextStep()

  const layout = computed(() => {
    let y = 40
    let i = 0
    const regions: MapRegion[] = []
    const nodes: MapNode[] = []
    for (const r of REGIONS) {
      const top = y
      y += BANNER
      for (const id of r.modules) {
        const mod = moduleById(id)!
        const stats = hero.moduleStats(mod)
        const unlocked = hero.isUnlocked(id)
        nodes.push({
          mod,
          stats,
          unlocked,
          x: XS[i % XS.length],
          y: y + 40,
          current: next.value?.mod.id === id,
          state: !unlocked ? 'locked' : stats.cleared ? 'cleared' : stats.done || stats.boss.attempts ? 'progress' : 'open',
        })
        y += STEP
        i++
      }
      const cleared = r.modules.every((id) => hero.moduleStats(moduleById(id)!).cleared)
      regions.push({ ...r, top, height: y - top - 20, cleared })
      y += 20
    }
    return { regions, nodes, height: y + 40 }
  })

  const trail = computed(() => curve(layout.value.nodes))

  // Пройдена частина стежки: до першої непройденої локації включно
  const trailDone = computed(() => {
    const nodes = layout.value.nodes
    const last = nodes.findLastIndex((n) => n.stats.cleared)
    if (last < 0) return ''
    return curve(nodes.slice(0, Math.min(last + 2, nodes.length)).filter((n) => n.unlocked))
  })

  return { layout, trail, trailDone, next }
}
