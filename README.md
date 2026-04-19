# Slavik Gym

Personal workout tracker on Next.js + Postgres.

## Local setup

1. `npm install`
2. Create Neon database at https://neon.tech and copy `DATABASE_URL`
3. Create `.env.local`:

```env
DATABASE_URL="postgresql://..."
```

4. `npm run db:push` - create tables
5. `npm run db:seed` - load 3 existing workouts
6. `npm run dev` - open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import project at https://vercel.com
3. Add env variable `DATABASE_URL`
4. Deploy
5. Run seed once via Vercel CLI or locally against the production database: `npm run db:seed`

## Usage

- Главный экран - статус последней тренировки и рекомендации весов
- `Начать тренировку` - активная тренировка с автосохранением каждые 0.5 сек
- История - все тренировки с детализацией
- Прогресс - графики по каждому упражнению
- Export CSV - скачать всю историю
