import { isoDay } from '../lib/date'

// Кількість днів поспіль із активністю; сьогоднішній день ще може бути попереду
export function calcStreak(days: readonly string[], now: Date = new Date()): number {
  const set = new Set(days)
  const d = new Date(now)
  if (!set.has(isoDay(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (set.has(isoDay(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}
