import { NextResponse } from 'next/server';
import { DEFAULT_PROGRAM } from '@/lib/program';
import { prisma } from '@/lib/prisma';
import { serializeWorkout } from '@/lib/workout-mapper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HEADERS = [
  'Date',
  'Workout',
  'Exercise',
  'Set',
  'Weight',
  'Reps',
  'Notes',
  'WatchDuration',
  'WatchCalories',
  'WatchAvgHr',
  'WatchMaxHr'
];

function csvEscape(value: string | number | null | undefined) {
  const text = value === null || value === undefined ? '' : String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: [{ date: 'asc' }, { number: 'asc' }],
      include: {
        sets: {
          orderBy: [{ exerciseId: 'asc' }, { setIndex: 'asc' }]
        }
      }
    });

    const rows: Array<Array<string | number | null | undefined>> = [HEADERS];

    workouts.map(serializeWorkout).forEach((workout) => {
      DEFAULT_PROGRAM.exercises.forEach((exercise) => {
        const sets = workout.sets[exercise.id];
        if (!sets) return;

        sets.forEach((set, index) => {
          rows.push([
            workout.date,
            workout.label,
            exercise.name,
            index + 1,
            set.w,
            set.r,
            workout.notes,
            workout.watch?.duration,
            workout.watch?.calories,
            workout.watch?.avgHr,
            workout.watch?.maxHr
          ]);
        });
      });
    });

    const csv = `\uFEFF${rows.map((row) => row.map(csvEscape).join(',')).join('\n')}`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="slavik-gym-export.csv"'
      }
    });
  } catch {
    return NextResponse.json({ error: 'Failed to export workouts' }, { status: 500 });
  }
}
