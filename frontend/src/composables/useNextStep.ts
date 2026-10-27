import { computed } from 'vue'
import { modules } from '../services/course'
import { nextStep } from '../domain/next'
import { useHeroStore } from '../stores/hero'

export function useNextStep() {
  const hero = useHeroStore()
  return computed(() => nextStep(modules, hero))
}
