'use client';

import { ChevronRight } from 'lucide-react';
import { formatDate } from '@/lib/format';
import type { Workout } from '@/lib/types';

interface HistoryTabProps {
  history: Workout[];
  onView: (workout: Workout) => void;
}

export default function HistoryTab({ history, onView }: HistoryTabProps) {
  return (
    <div className="p-4 pt-6">
      <h2 className="mb-4 text-2xl font-black uppercase tracking-wider">История</h2>
      <div className="space-y-2">
        {history.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-500">Нет тренировок</div>
        ) : (
          [...history].reverse().map((workout) => (
            <button
              key={workout.id}
              type="button"
              onClick={() => onView(workout)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-3 hover:border-orange-500/50"
            >
              <div className="text-left">
                <div className="text-sm font-bold">{workout.label}</div>
                <div className="text-xs text-slate-500">{formatDate(workout.date)}</div>
                {workout.watch?.calories ? (
                  <div className="mt-1 text-[10px] text-orange-400">
                    {workout.watch.duration ? `${workout.watch.duration} мин` : 'Без времени'} · {workout.watch.calories} ккал
                  </div>
                ) : null}
              </div>
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
