import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeWorkout, setsToCreateInput } from '@/lib/workout-mapper';
import type { Workout } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseDate(value?: string) {
  if (!value) return new Date();
  return new Date(`${value}T00:00:00.000Z`);
}

function includeSets() {
  return {
    sets: {
      orderBy: [{ exerciseId: 'asc' as const }, { setIndex: 'asc' as const }]
    }
  };
}

// One-shot self-healing migration: workout #11 was saved with the wrong
// date (2026-05-14) due to the cold-start save failure. Once the date is
// already 2026-05-11 this is a single indexed read and no-op.
async function ensureWorkout11Date() {
  try {
    const w11 = await prisma.workout.findFirst({ where: { number: 11 } });
    if (!w11) return;
    if (w11.date.toISOString().slice(0, 10) === '2026-05-11') return;
    await prisma.workout.update({
      where: { id: w11.id },
      data: { date: new Date('2026-05-11T00:00:00.000Z') }
    });
  } catch {
    // Migration must never break the main GET response.
  }
}

export async function GET() {
  try {
    await ensureWorkout11Date();

    const workouts = await prisma.workout.findMany({
      orderBy: [{ date: 'asc' }, { number: 'asc' }],
      include: includeSets()
    });

    return NextResponse.json(workouts.map(serializeWorkout));
  } catch {
    return NextResponse.json({ error: 'Failed to load workouts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Workout;

    if (!body.date || !body.sets) {
      return NextResponse.json({ error: 'date and sets are required' }, { status: 400 });
    }

    const maxNumber = await prisma.workout.aggregate({
      _max: { number: true }
    });
    const number = body.number ?? (maxNumber._max.number ?? 0) + 1;

    const created = await prisma.workout.create({
      data: {
        number,
        kind: body.kind ?? 'gym',
        label: body.label || `Тренировка #${number}`,
        date: parseDate(body.date),
        warmupTime: body.warmup?.time ?? null,
        warmupDistance: body.warmup?.distance ?? null,
        watchDuration: body.watch?.duration ?? null,
        watchCalories: body.watch?.calories ?? null,
        watchAvgHr: body.watch?.avgHr ?? null,
        watchMaxHr: body.watch?.maxHr ?? null,
        notes: body.notes || null,
        sets: {
          create: setsToCreateInput(body.sets)
        }
      },
      include: includeSets()
    });

    return NextResponse.json(serializeWorkout(created), { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create workout' }, { status: 500 });
  }
}
