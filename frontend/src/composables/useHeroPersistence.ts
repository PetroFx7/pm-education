import { watch } from 'vue'
import { useHeroStore } from '../stores/hero'
import { useSyncStore } from '../stores/sync'
import { useAuthStore } from '../stores/auth'

// Автозбереження прогресу героя в хмару (лише після входу; у режимі перегляду нічого не зберігається)
export function useHeroPersistence() {
  const hero = useHeroStore()
  const sync = useSyncStore()
  const auth = useAuthStore()
  watch(() => hero.$state, (state) => sync.onLocalChange(state), { deep: true })
  // Вкладку ховають або закривають — відправляємо незбережене одразу
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sync.push()
  })
  // Повернулася мережа — довантажуємо або відправляємо те, що не вдалося
  window.addEventListener('online', () => {
    if (!auth.user) return
    if (!sync.loaded) sync.load()
    else sync.push()
  })
  return hero
}
