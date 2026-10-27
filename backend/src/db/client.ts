import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema.js'

// HTTP-драйвер Neon: без постійних з'єднань, підходить для serverless
export const db = drizzle(neon(process.env.DATABASE_URL!), { schema })
