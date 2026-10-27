// Локальний запуск без Vercel CLI: npm run dev
import { serve } from '@hono/node-server'
import app from './index.js'

const port = Number(process.env.PORT ?? 3000)
serve({ fetch: app.fetch, port }, () => console.log(`API: http://localhost:${port}/api/health`))
