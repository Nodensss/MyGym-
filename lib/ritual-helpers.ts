import { ALL_EXERCISES } from '@/lib/program';
import type { MuscleIntensity } from '@/components/ritual/RitualFigure';
import type { Workout } from '@/lib/types';

const MUSCLE_MAP: Record<string, keyof MuscleIntensity> = {
  bench: 'chest',
  push_up: 'chest',
  lat_pull: 'back',
  row: 'back',
  pull_up: 'back',
  shoulder_press: 'shoulders',
  biceps: 'arms',
  leg_press: 'legs',
  leg_ext: 'legs',
  leg_raise: 'core'
};

const MONTHS_LAT = ['IAN', 'FEB', 'MAR', 'APR', 'MAI', 'IUN', 'IUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function formatRitualDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`);
  return `${String(date.getDate()).padStart(2, '0')} · ${MONTHS_LAT[date.getMonth()]} · ${date.getFullYear()}`;
}

export function totalKgLifted(workout: Workout): number {
  let total = 0;
  for (const sets of Object.values(workout.sets)) {
    for (const set of sets) {
      const w = Number(set.w) || 0;
      const r = Number(set.r) || 0;
      total += w * r;
    }
  }
  return Math.round(total);
}

export function daysBetween(fromIso: string, toIso: string): number {
  const from = new Date(`${fromIso}T00:00:00`).getTime();
  const to = new Date(`${toIso}T00:00:00`).getTime();
  return Math.max(0, Math.floor((to - from) / (1000 * 60 * 60 * 24)));
}

export function computeMuscleIntensity(history: Workout[], days = 7): MuscleIntensity {
  if (!history.length) return {};
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffIso = cutoff.toLocaleDateString('sv-SE');

  const weights: Record<keyof MuscleIntensity, number> = {
    chest: 0,
    back: 0,
    shoulders: 0,
    arms: 0,
    core: 0,
    legs: 0
  };

  for (const workout of history) {
    if (workout.date < cutoffIso) continue;
    for (const [exId, sets] of Object.entries(workout.sets)) {
      const muscle = MUSCLE_MAP[exId];
      if (!muscle) continue;
      for (const set of sets) {
        const w = Number(set.w) || 0;
        const r = Number(set.r) || 0;
        const value = w > 0 ? w * r : r;
        weights[muscle] += value;
      }
    }
  }

  const max = Math.max(...Object.values(weights), 1);
  const out: MuscleIntensity = {};
  (Object.keys(weights) as Array<keyof MuscleIntensity>).forEach((key) => {
    out[key] = weights[key] / max;
  });
  return out;
}

export interface RitualPr {
  id: string;
  name: string;
  value: string;
  unit: string;
  count: number;
}

export function computePRs(history: Workout[], limit = 4): RitualPr[] {
  const prs = new Map<string, { max: number; count: number }>();
  for (const workout of history) {
    for (const [exId, sets] of Object.entries(workout.sets)) {
      const exercise = ALL_EXERCISES.find((e) => e.id === exId);
      if (!exercise) continue;
      for (const set of sets) {
        const value = exercise.noWeight ? Number(set.r) || 0 : Number(set.w) || 0;
        const current = prs.get(exId) ?? { max: 0, count: 0 };
        if (value > current.max) prs.set(exId, { max: value, count: 1 });
        else if (value === current.max && value > 0) prs.set(exId, { max: current.max, count: current.count + 1 });
      }
    }
  }

  const result: RitualPr[] = [];
  prs.forEach((pr, id) => {
    if (pr.max <= 0) return;
    const ex = ALL_EXERCISES.find((e) => e.id === id);
    if (!ex) return;
    const shortName = id.replace(/_/g, '·').toUpperCase();
    const unit = ex.noWeight ? 'RAZ' : ex.unit === 'плиток' ? 'PL' : 'KG';
    result.push({ id, name: shortName, value: String(pr.max), unit, count: pr.count });
  });
  result.sort((a, b) => b.count - a.count);
  return result.slice(0, limit);
}

const MONTH_NAMES_LAT = ['IANUARIUS', 'FEBRUARIUS', 'MARTIUS', 'APRILIS', 'MAIUS', 'IUNIUS', 'IULIUS', 'AUGUSTUS', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

export function getCalendarMonth(history: Workout[]) {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7;

  const workedDates = new Set(
    history
      .filter((workout) => {
        const d = new Date(`${workout.date}T00:00:00`);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map((workout) => Number(workout.date.slice(8, 10)))
  );

  const days = Array.from({ length: daysInMonth }, (_, i) => ({
    d: i + 1,
    worked: workedDates.has(i + 1),
    today: i + 1 === today.getDate()
  }));

  return {
    days,
    offset,
    monthName: MONTH_NAMES_LAT[month].toLowerCase(),
    workedCount: workedDates.size,
    daysInMonth
  };
}
