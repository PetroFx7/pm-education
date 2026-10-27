import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { and, eq, sql } from 'drizzle-orm'
import { db } from './db/client.js'
import { saves } from './db/schema.js'
import type { AppEnv } from './env.js'

const MAX_SAVE_BYTES = 256 * 1024

type SaveRow = typeof saves.$inferSelect

const toDto = (row: SaveRow | undefined) =>
  row ? { data: row.data, version: row.version, updatedAt: row.updatedAt } : { data: null, version: 0, updatedAt: null }

export const save = new Hono<AppEnv>()

save.use('*', async (c, next) => {
  if (!c.get('user')) return c.json({ error: 'Unauthorized' }, 401)
  await next()
})

// GET /api/save → { data, version, updatedAt }; version 0 — збереження ще немає
save.get('/', async (c) => {
  const [row] = await db.select().from(saves).where(eq(saves.userId, c.get('user')!.id))
  return c.json(toDto(row))
})

// PUT /api/save { data, version } — version: остання версія, яку бачив клієнт (0 для першого запису).
// Якщо на сервері вже новіша версія — 409 і актуальне збереження, щоб клієнт вирішив, що лишити.
save.put(
  '/',
  bodyLimit({ maxSize: MAX_SAVE_BYTES, onError: (c) => c.json({ error: 'Save is too large' }, 413) }),
  async (c) => {
    const userId = c.get('user')!.id
    const body = await c.req.json().catch(() => null)
    const data = body?.data
    const version = body?.version
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return c.json({ error: '`data` must be an object' }, 400)
    if (!Number.isInteger(version) || version < 0) return c.json({ error: '`version` must be a non-negative integer' }, 400)

    const xp = Number.isFinite(data.xp) ? Math.max(0, Math.floor(data.xp)) : 0

    const [row] =
      version === 0
        ? await db.insert(saves).values({ userId, data, xp }).onConflictDoNothing().returning()
        : await db
            .update(saves)
            .set({ data, xp, version: sql`${saves.version} + 1`, updatedAt: new Date() })
            .where(and(eq(saves.userId, userId), eq(saves.version, version)))
            .returning()

    if (row) return c.json(toDto(row))

    const [current] = await db.select().from(saves).where(eq(saves.userId, userId))
    return c.json({ error: 'Conflict', current: toDto(current) }, 409)
  },
)

// DELETE /api/save — скинути хмарне збереження (напр., разом зі «Скинути прогрес»)
save.delete('/', async (c) => {
  await db.delete(saves).where(eq(saves.userId, c.get('user')!.id))
  return c.json({ ok: true })
})
