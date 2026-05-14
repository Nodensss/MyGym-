import { prisma } from '@/lib/prisma';

// One-shot self-healing migration: workout #11 was saved with the wrong
// date (2026-05-14) due to the cold-start save failure on 2026-05-11.
//
// Implemented via raw SQL so it works regardless of how the Neon driver
// adapter materialises the @db.Date column (Date vs string). Idempotent:
// the WHERE clause excludes already-fixed rows so the UPDATE returns 0
// once the data is correct.
export async function ensureWorkout11Date(): Promise<number> {
  try {
    const updated = await prisma.$executeRaw`
      UPDATE "Workout"
      SET "date" = DATE '2026-05-11'
      WHERE "number" = 11
        AND "date" <> DATE '2026-05-11'
    `;

    if (updated > 0) {
      console.log(`[migration] ensureWorkout11Date: fixed ${updated} row(s)`);
    }
    return Number(updated);
  } catch (error) {
    console.error('[migration] ensureWorkout11Date failed:', error);
    return 0;
  }
}
