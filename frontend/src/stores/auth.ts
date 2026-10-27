import { defineStore } from 'pinia'
import { api, ApiError, clearToken, getToken } from '../services/api'
import { useSyncStore } from './sync'

export interface AuthUser {
  id: string
  name: string
  email: string
}

const MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: 'Невірний email або пароль',
  USER_ALREADY_EXISTS: 'Акаунт із таким email уже існує',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Акаунт із таким email уже існує',
  INVALID_EMAIL: 'Некоректний email',
  PASSWORD_TOO_SHORT: 'Пароль має містити щонайменше 8 символів',
}

export function authErrorMessage(e: unknown): string {
  if (e instanceof ApiError) return (e.code && MESSAGES[e.code]) || e.message
  return 'Щось пішло не так. Спробуй ще раз.'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    ready: false, // сесію вже перевірено при старті
  }),

  getters: {
    signedIn: (s): boolean => s.user !== null,
  },

  actions: {
    // Відновлення сесії за збереженим токеном
    async restore() {
      if (getToken()) {
        try {
          const { user } = await api<{ user: AuthUser }>('/api/me')
          this.user = user
        } catch (e) {
          if (e instanceof ApiError && e.status === 401) clearToken()
        }
      }
      this.ready = true
    },

    async signIn(email: string, password: string) {
      const { user } = await api<{ user: AuthUser }>('/api/auth/sign-in/email', { method: 'POST', body: { email, password } })
      this.user = user
    },

    async signUp(name: string, email: string, password: string) {
      const { user } = await api<{ user: AuthUser }>('/api/auth/sign-up/email', { method: 'POST', body: { name, email, password } })
      this.user = user
    },

    async signOut() {
      const sync = useSyncStore()
      await sync.flush()
      try {
        await api('/api/auth/sign-out', { method: 'POST', body: {} })
      } catch {
        /* локально виходимо в будь-якому разі */
      }
      clearToken()
      sync.toPreview()
    },
  },
})
