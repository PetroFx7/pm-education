import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth, frontendOrigins } from './auth.js'
import { save } from './save.js'
import type { AppEnv } from './env.js'

const app = new Hono<AppEnv>()

app.use(
  '/api/*',
  cors({
    origin: frontendOrigins(),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['set-auth-token'],
    maxAge: 600,
  }),
)

// Поточний користувач (за Bearer-токеном) для всіх роутів
app.use('/api/*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  c.set('user', session?.user ?? null)
  c.set('session', session?.session ?? null)
  await next()
})

// Реєстрація, вхід, вихід: /api/auth/sign-up/email, /sign-in/email, /sign-out, /get-session
app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.get('/api/health', (c) => c.json({ ok: true }))

app.get('/api/me', (c) => {
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)
  return c.json({ user })
})

app.route('/api/save', save)

export default app
