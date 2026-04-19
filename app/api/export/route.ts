import { NextResponse } from 'next/server';
import { DEFAULT_PROGRAM } from '@/lib/program';
import { prisma } from '@/lib/prisma';
import { serializeWorkout } from '@/lib/workout-mapper';
import type { Workout } from '@/lib/types';

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

function setSummary(workout: Workout, exerciseId: string, noWeight?: boolean) {
  const sets = workout.sets[exerciseId];
  if (!sets?.length) return 'нет данных';

  return sets
    .map((set, index) => {
      const value = noWeight ? `${set.r || 0} раз` : `${set.w || 0} x ${set.r || 0}`;
      return `${index + 1}) ${value}`;
    })
    .join('; ');
}

function totalReps(workout: Workout, exerciseId: string) {
  return workout.sets[exerciseId]?.reduce((sum, set) => sum + (Number(set.r) || 0), 0) ?? 0;
}

function maxWeight(workout: Workout, exerciseId: string) {
  const sets = workout.sets[exerciseId];
  return sets ? Math.max(...sets.map((set) => Number(set.w) || 0), 0) : 0;
}

function buildAiReport(workouts: Workout[]) {
  const lines = [
    '# Slavik Gym - training history export',
    '',
    'Purpose: compact context for an AI coach. Analyze progression, fatigue, exercise choices, and suggest safe next workout targets.',
    '',
    `Exported workouts: ${workouts.length}`,
    `Program: ${DEFAULT_PROGRAM.name}`,
    `Scheme: ${DEFAULT_PROGRAM.scheme}`,
    '',
    '## Exercise Reference',
    ''
  ];

  DEFAULT_PROGRAM.exercises.forEach((exercise) => {
    lines.push(
      `- ${exercise.id}: ${exercise.name}; group: ${exercise.group}; target: ${exercise.target}; unit: ${
        exercise.noWeight ? 'bodyweight reps' : exercise.unit
      }; hint: ${exercise.hint || 'none'}`
    );
  });

  lines.push('', '## Workout Log', '');

  workouts.forEach((workout) => {
    lines.push(`### ${workout.label} - ${workout.date}`);
    lines.push(`- Warmup: ${workout.warmup.time || 0} min, ${workout.warmup.distance || 0} km`);

    if (workout.watch && (workout.watch.duration || workout.watch.calories || workout.watch.avgHr || workout.watch.maxHr)) {
      lines.push(
        `- Watch: duration ${workout.watch.duration || 0} min; calories ${workout.watch.calories || 0}; avg HR ${
          workout.watch.avgHr || 0
        }; max HR ${workout.watch.maxHr || 0}`
      );
    }

    if (workout.notes) {
      lines.push(`- Notes: ${workout.notes}`);
    }

    lines.push('- Sets:');
    DEFAULT_PROGRAM.exercises.forEach((exercise) => {
      const sets = workout.sets[exercise.id];
      if (!sets?.length) return;

      const metric = exercise.noWeight
        ? `total reps ${totalReps(workout, exercise.id)}`
        : `max ${maxWeight(workout, exercise.id)} ${exercise.unit}`;

      lines.push(`  - ${exercise.name}: ${setSummary(workout, exercise.id, exercise.noWeight)} (${metric})`);
    });

    lines.push('');
  });

  lines.push('## Progress Summary', '');

  DEFAULT_PROGRAM.exercises.forEach((exercise) => {
    const values = workouts.map((workout) =>
      exercise.noWeight ? totalReps(workout, exercise.id) : maxWeight(workout, exercise.id)
    );
    const nonZero = values.filter((value) => value > 0);
    if (nonZero.length === 0) return;

    const first = nonZero[0];
    const last = nonZero[nonZero.length - 1];
    const best = Math.max(...nonZero);
    const unit = exercise.noWeight ? 'reps total' : exercise.unit;
    lines.push(`- ${exercise.name}: first ${first} ${unit}; last ${last} ${unit}; best ${best} ${unit}; change ${last - first}`);
  });

  lines.push(
    '',
    '## Suggested AI Task',
    '',
    'Review this log and propose the next workout weights/reps. Keep increases conservative after breaks, flag overload risks, and explain changes briefly.'
  );

  return lines.join('\n');
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format');
    const workouts = await prisma.workout.findMany({
      orderBy: [{ date: 'asc' }, { number: 'asc' }],
      include: {
        sets: {
          orderBy: [{ exerciseId: 'asc' }, { setIndex: 'asc' }]
        }
      }
    });

    const serialized = workouts.map(serializeWorkout);

    if (format === 'ai') {
      return new NextResponse(buildAiReport(serialized), {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': 'attachment; filename="slavik-gym-for-claude.md"'
        }
      });
    }

    const rows: Array<Array<string | number | null | undefined>> = [HEADERS];

    serialized.forEach((workout) => {
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
