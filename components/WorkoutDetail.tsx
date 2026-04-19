'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { getProgramByKind } from '@/lib/program';
import type { Workout } from '@/lib/types';

interface WorkoutDetailProps {
  workout: Workout;
  onBack: () => void;
  onDelete: () => void;
}

export default function WorkoutDetail({ workout, onBack, onDelete }: WorkoutDetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const program = getProgramByKind(workout.kind);

  return (
    <div className="min-h-screen bg-slate-950 pb-8 text-slate-100">
      <div className="active-workout-header mx-auto max-w-md px-4 pb-4">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={onBack} className="relative z-10 text-sm text-slate-400">
            ← Назад
          </button>
          {confirmDelete ? (
            <div className="flex gap-1">
              <button type="button" onClick={() => setConfirmDelete(false)} className="px-2 py-1 text-xs text-slate-400">
                Отмена
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="rounded border border-red-500/40 bg-red-500/20 px-2 py-1 text-xs text-red-400"
              >
                Удалить
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="relative z-10 text-xs text-red-400/60">
              Удалить
            </button>
          )}
        </div>

        <div className="mb-5 text-center">
          <div className="text-2xl font-black">{workout.label}</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-orange-400">{program.shortName}</div>
          <div className="text-sm text-slate-500">{formatDate(workout.date)}</div>
        </div>

        {workout.warmup && (workout.warmup.time || workout.warmup.distance) ? (
          <div className="mb-3 rounded-lg border-l-[3px] border-red-500 bg-red-500/10 p-3">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-red-400">Разминка</div>
            <div className="text-sm">
              {workout.warmup.time} мин · {workout.warmup.distance} км
            </div>
          </div>
        ) : null}

        {program.exercises.map((exercise) => {
          const sets = workout.sets[exercise.id];
          if (!sets || sets.every((set) => !set.w && !set.r)) return null;

          return (
            <div key={exercise.id} className="mb-2 rounded-xl border border-slate-800 bg-slate-900 p-3">
              <div className="mb-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-orange-400">{exercise.group}</div>
                <div className="text-sm font-bold">{exercise.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {sets.map((set, index) => (
                  <div key={`${exercise.id}-${index}`} className="rounded bg-slate-950 p-1.5 text-center">
                    <div className="text-[9px] uppercase text-slate-500">Сет {index + 1}</div>
                    <div className="text-xs font-bold text-green-400">
                      {exercise.noWeight ? '—' : set.w || '—'} × {set.r || '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {workout.watch && (workout.watch.calories || workout.watch.avgHr) ? (
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
            <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <Heart size={12} /> Часы
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {workout.watch.duration ? (
                <div>
                  <span className="text-slate-500">Время:</span> <b>{workout.watch.duration} мин</b>
                </div>
              ) : null}
              {workout.watch.calories ? (
                <div>
                  <span className="text-slate-500">Ккал:</span> <b>{workout.watch.calories}</b>
                </div>
              ) : null}
              {workout.watch.avgHr ? (
                <div>
                  <span className="text-slate-500">Пульс ср:</span> <b>{workout.watch.avgHr}</b>
                </div>
              ) : null}
              {workout.watch.maxHr ? (
                <div>
                  <span className="text-slate-500">Пульс макс:</span> <b>{workout.watch.maxHr}</b>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {workout.notes ? (
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Заметки</div>
            <div className="text-xs italic text-slate-300">{workout.notes}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
