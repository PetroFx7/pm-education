import type { auth } from './auth.js'

// Змінні контексту Hono, які заповнює middleware сесії
export type AppEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}
