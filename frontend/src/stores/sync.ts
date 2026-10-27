// Прогрес героя живе лише в хмарі (/api/save) і лише для тих, хто увійшов.
// Без входу — режим перегляду: усе відкрито, нічого не зберігається й не надсилається.
import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'
import { freshHero, guestHero, type HeroState } from '../domain/hero'
import router from '../app/router'
import { useHeroStore } from './hero'
import { useAuthStore } from './auth'
import { useUiStore } from './ui'

interface CloudSave {
  data: Partial<HeroState> | null
  version: number
  updatedAt: string | null
}

const PUSH_DELAY = 1500
const KEEPALIVE_MAX = 60_000 // браузери обмежують keepalive-запити ~64 КБ

let timer: ReturnType<typeof setTimeout> | undefined
let inFlight: Promise<void> | null = null
let appliedJson: string | null = null // стан, який ми самі підставили: його зміну не відправляємо

export const useSyncStore = defineStore('sync', {
  state: () => ({
    status: 'idle' as 'idle' | 'syncing' | 'synced' | 'error',
    loaded: false, // прогрес акаунта завантажено з хмари
    version: 0, // версія збереження на сервері (0 — ще немає)
    dirty: false, // є зміни, яких ще немає на сервері
  }),

  actions: {
    // Викликається на кожну зміну стану героя
    onLocalChange(state: HeroState) {
      if (appliedJson !== null && JSON.stringify(state) === appliedJson) return
      appliedJson = null
      if (!this.loaded || !useAuthStore().user) return
      this.dirty = true
      clearTimeout(timer)
      timer = setTimeout(() => this.push(), PUSH_DELAY)
    },

    // Після входу або відновлення сесії
    async load() {
      if (!useAuthStore().user) return
      this.status = 'syncing'
      try {
        this.apply(await api<CloudSave>('/api/save'))
        this.loaded = true
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return this.toPreview()
        this.status = 'error'
      }
    },

    async push(): Promise<void> {
      clearTimeout(timer)
      if (inFlight) {
        await inFlight
        if (this.dirty) return this.push()
        return
      }
      if (!this.loaded || !this.dirty || !useAuthStore().user) return
      inFlight = this.send()
      try {
        await inFlight
      } finally {
        inFlight = null
      }
    },

    async send() {
      const hero = useHeroStore()
      const json = JSON.stringify(hero.$state)
      this.status = 'syncing'
      try {
        const res = await api<CloudSave>('/api/save', {
          method: 'PUT',
          body: { data: JSON.parse(json), version: this.version },
          keepalive: json.length < KEEPALIVE_MAX,
        })
        this.version = res.version
        this.dirty = JSON.stringify(hero.$state) !== json
        this.status = 'synced'
        if (this.dirty) timer = setTimeout(() => this.push(), PUSH_DELAY)
      } catch (e) {
        if (e instanceof ApiError && e.status === 409) {
          // Прогрес змінили на іншому пристрої — показуємо актуальний
          this.apply((e.data as { current: CloudSave }).current)
          useUiStore().info('Прогрес оновлено', 'Його змінили на іншому пристрої.')
          return
        }
        if (e instanceof ApiError && e.status === 401) return this.toPreview()
        this.status = 'error'
      }
    },

    apply(server: CloudSave) {
      this.setHero({ ...freshHero(), ...server.data })
      this.version = server.version
      this.dirty = false
      this.status = 'synced'
    },

    // Вихід або прострочена сесія: назад у режим перегляду
    toPreview() {
      clearTimeout(timer)
      useAuthStore().user = null
      this.$reset()
      this.setHero(guestHero())
    },

    setHero(state: HeroState) {
      const hero = useHeroStore()
      hero.$patch((s) => Object.assign(s, state))
      appliedJson = JSON.stringify(hero.$state)

      const route = router.currentRoute.value
      if (!hero.created && route.name !== 'create' && route.name !== 'auth') router.replace('/create')
      else if (hero.created && route.name === 'create') router.replace('/map')
    },

    // Перед виходом: відправити незбережене
    async flush() {
      if (this.dirty) await this.push()
    },
  },
})
