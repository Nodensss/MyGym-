import { DEFAULT_PROGRAM } from '@/lib/program';
import type { Recommendation, Workout } from '@/lib/types';

export function getRecommendations(history: Workout[]): Recommendation[] {
  if (history.length === 0) return [];

  const last = history[history.length - 1];
  const recs: Recommendation[] = [];

  DEFAULT_PROGRAM.exercises.forEach((exercise) => {
    const sets = last.sets[exercise.id];
    if (!sets || sets.every((set) => !set.w)) return;

    const weights = sets.map((set) => Number(set.w) || 0);
    const allSame = weights.every((weight) => weight === weights[0]) && weights[0] > 0;
    const maxWeight = Math.max(...weights);

    if (exercise.id === 'biceps' && weights[0] >= 15) {
      recs.push({
        name: exercise.name,
        suggestion: `${maxWeight} кг (закрепить)`,
        change: 'same'
      });
    } else if (allSame) {
      recs.push({
        name: exercise.name,
        suggestion: `${maxWeight + exercise.step} ${exercise.unit} ↑`,
        change: 'up'
      });
    } else {
      recs.push({
        name: exercise.name,
        suggestion: `${maxWeight} ${exercise.unit} (закрепить)`,
        change: 'same'
      });
    }
  });

  return recs.slice(0, 5);
}
