import { pgTable, text, jsonb, integer, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth-schema.js'

// Таблиці Better Auth генеруються в auth-schema.ts (npm run auth:schema), тут — наші
export * from './auth-schema.js'

// Прогрес героя: увесь HeroState одним JSON. `version` росте з кожним збереженням —
// так сервер помічає, що клієнт пише поверх новішого прогресу з іншого пристрою.
export const saves = pgTable('saves', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  data: jsonb('data').notNull(),
  xp: integer('xp').notNull().default(0), // окремо від data — для лідерборду
  version: integer('version').notNull().default(1),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
