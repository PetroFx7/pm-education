// HTTP-клієнт бекенду. Фронтенд і API на різних доменах, тож авторизація —
// через Bearer-токен (бекенд віддає його в заголовку `set-auth-token`).
import { readSave, writeSave, clearSave } from './storage'

export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

const TOKEN_KEY = 'pm-quest-auth-token'

export const getToken = (): string | null => readSave<string>(TOKEN_KEY) as string | null
export const setToken = (token: string): void => writeSave(TOKEN_KEY, token)
export const clearToken = (): void => clearSave(TOKEN_KEY)

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string | undefined,
    message: string,
    readonly data: unknown = null,
  ) {
    super(message)
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  keepalive?: boolean // запит доживе до кінця, навіть якщо вкладку закривають
}

export async function api<T>(path: string, { method = 'GET', body, keepalive }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, keepalive, body: body === undefined ? undefined : JSON.stringify(body) })
  } catch {
    throw new ApiError(0, 'NETWORK', 'Сервер недоступний. Перевір з’єднання.')
  }

  const fresh = res.headers.get('set-auth-token')
  if (fresh) setToken(fresh)

  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, data?.code, data?.message ?? data?.error ?? `Помилка ${res.status}`, data)
  return data as T
}
