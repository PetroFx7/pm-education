import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { bearer } from 'better-auth/plugins'
import { db } from './db/client.js'
import * as schema from './db/schema.js'

// Фронтенд живе на іншому домені (GitHub Pages), тож cookies між сайтами
// ненадійні — клієнт отримує токен із заголовка `set-auth-token`
// і надсилає його як `Authorization: Bearer <token>`.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  trustedOrigins: frontendOrigins(),
  plugins: [bearer()],
})

export function frontendOrigins(): string[] {
  return (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
}
