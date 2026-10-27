import { pick, randomInt } from '../lib/random'
import type { Artifact, Rarity } from './types'

export function rollRarity(roll: number = Math.random()): Rarity {
  if (roll > 0.93) return 'legendary'
  if (roll > 0.75) return 'epic'
  if (roll > 0.4) return 'rare'
  return 'common'
}

export function rollChest(artifacts: readonly Artifact[]): { item: Artifact; gold: number } {
  const rarity = rollRarity()
  return {
    item: pick(artifacts.filter((a) => a.rarity === rarity)),
    gold: randomInt(40, 99),
  }
}
