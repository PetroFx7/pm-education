# PM Quest API

Hono + Better Auth + Drizzle + Neon Postgres. Деплой — Vercel (Root Directory = `backend`, Function Region = `fra1`).

```bash
cp .env.example .env.local   # заповнити DATABASE_URL і BETTER_AUTH_SECRET
npm install
npm run db:migrate           # створити таблиці в Neon
npm run dev                  # http://localhost:3000/api/health
```

## Ендпоінти

| Метод | Шлях | Що робить |
|---|---|---|
| POST | `/api/auth/sign-up/email` | `{ name, email, password }` → реєстрація |
| POST | `/api/auth/sign-in/email` | `{ email, password }` → вхід |
| POST | `/api/auth/sign-out` | вихід |
| GET | `/api/auth/get-session` | поточна сесія |
| GET | `/api/me` | поточний користувач або 401 |
| GET | `/api/health` | перевірка, що API живе |
| GET | `/api/save` | прогрес героя `{ data, version, updatedAt }` (`version: 0` — збереження ще немає) |
| PUT | `/api/save` | `{ data, version }` → зберегти; `version` — остання версія, яку бачив клієнт (0 для першого запису) |
| DELETE | `/api/save` | видалити хмарне збереження |

`/api/save` вимагає токен. Якщо на сервері вже новіша версія (збереження з іншого пристрою),
`PUT` повертає `409 { error: 'Conflict', current }` — клієнт сам вирішує, яку версію лишити.
Ліміт розміру — 256 КБ.

Після входу токен приходить у заголовку відповіді `set-auth-token`. Фронтенд зберігає його
і надсилає в кожному запиті як `Authorization: Bearer <token>`.

## Схема БД

- `src/db/auth-schema.ts` — таблиці Better Auth (генерується: `npm run auth:schema`, руками не редагувати).
- `src/db/schema.ts` — наші таблиці (`saves`) + реекспорт auth-схеми.
- Після змін схеми: `npm run db:generate` → `npm run db:migrate`.

## Змінні на Vercel

`DATABASE_URL` (додає інтеграція Neon), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (адреса API на Vercel),
`FRONTEND_ORIGIN` (`https://<user>.github.io`).
