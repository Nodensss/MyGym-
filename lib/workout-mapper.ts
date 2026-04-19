import type { WatchStats, Workout, WorkoutKind, WorkoutSet, WorkoutSets } from '@/lib/types';
import { getProgramByKind } from '@/lib/program';

type DbSet = {
  exerciseId: string;
  setIndex: number;
  weight: number;
  reps: number;
};

export type DbWorkoutWithSets = {
  id: string;
  kind: string;
  number: number;
  label: string;
  date: Date;
  warmupTime: number | null;
  warmupDistance: number | null;
  watchDuration: number | null;
  watchCalories: number | null;
  watchAvgHr: number | null;
  watchMaxHr: number | null;
  notes: string | null;
  sets: DbSet[];
  createdAt: Date;
  updatedAt: Date;
};

export function blankSets(kind: WorkoutKind = 'gym'): WorkoutSets {
  const program = getProgramByKind(kind);

  return Object.fromEntries(
    program.exercises.map((exercise) => [
      exercise.id,
      [
        { w: exercise.noWeight ? 0 : exercise.defaultW, r: exercise.defaultR },
        { w: exercise.noWeight ? 0 : exercise.defaultW, r: exercise.defaultR },
        { w: exercise.noWeight ? 0 : exercise.defaultW, r: exercise.defaultR }
      ]
    ])
  );
}

export function serializeWorkout(workout: DbWorkoutWithSets): Workout {
  const sets: WorkoutSets = {};

  workout.sets
    .slice()
    .sort((a, b) => a.setIndex - b.setIndex)
    .forEach((set) => {
      if (!sets[set.exerciseId]) sets[set.exerciseId] = [];
      sets[set.exerciseId][set.setIndex] = { w: set.weight, r: set.reps };
    });

  const watch: WatchStats = {
    duration: workout.watchDuration ?? 0,
    calories: workout.watchCalories ?? 0,
    avgHr: workout.watchAvgHr ?? 0,
    maxHr: workout.watchMaxHr ?? 0
  };

  return {
    id: workout.id,
    kind: getProgramByKind(workout.kind).kind,
    number: workout.number,
    label: workout.label,
    date: workout.date.toISOString().slice(0, 10),
    warmup: {
      time: workout.warmupTime ?? 0,
      distance: workout.warmupDistance ?? 0
    },
    sets,
    watch,
    notes: workout.notes ?? '',
    createdAt: workout.createdAt.toISOString(),
    updatedAt: workout.updatedAt.toISOString()
  };
}

export function setsToCreateInput(sets: WorkoutSets) {
  return Object.entries(sets).flatMap(([exerciseId, entries]) =>
    entries.map((entry: WorkoutSet, setIndex) => ({
      exerciseId,
      setIndex,
      weight: Number(entry.w) || 0,
      reps: Number(entry.r) || 0
    }))
  );
}
