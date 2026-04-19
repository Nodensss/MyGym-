'use client';

import { useState } from 'react';
import { Activity, AlertTriangle, ChevronRight, Dumbbell, Play, TrendingUp, X } from 'lucide-react';
import { formatDate } from '@/lib/format';
import { DEFAULT_PROGRAM, getProgramByKind } from '@/lib/program';
import { getRecommendations } from '@/lib/recommendations';
import type { Workout, WorkoutKind } from '@/lib/types';

interface HomeTabProps {
  history: Workout[];
  activeWorkout: Workout | null;
  onStart: (kind: WorkoutKind) => void;
  onContinue: () => void;
  onView: (workout: Workout) => void;
}

function dayLabel(days: number) {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'дня';
  return 'дней';
}

export default function HomeTab({ history, activeWorkout, onStart, onContinue, onView }: HomeTabProps) {
  const [pendingStart, setPendingStart] = useState<WorkoutKind | null>(null);
  const last = history[history.length - 1];
  const lastDate = last ? new Date(`${last.date}T00:00:00`) : null;
  const today = new Date();
  const daysSince = lastDate ? Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const nextNum = Math.max(0, ...history.map((workout) => workout.number ?? 0)) + 1;
  const recommendations = getRecommendations(history);
  const activeProgram = getProgramByKind(activeWorkout?.kind);

  const requestStart = (kind: WorkoutKind) => {
    if (activeWorkout) {
      setPendingStart(kind);
      return;
    }

    onStart(kind);
  };

  const confirmStart = () => {
    if (!pendingStart) return;
    onStart(pendingStart);
    setPendingStart(null);
  };

  return (
    <div className="p-4">
      <div className="relative pb-5 pt-6 text-center">
        <div className="absolute right-2 top-4 text-7xl font-black leading-none text-orange-500/10">#{nextNum}</div>
        <div className="mb-3 inline-block rounded-full border border-orange-400/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400">
          Slavik · Full Body
        </div>
        <h1 className="text-3xl font-black uppercase leading-none tracking-wider">
          Возвращение
          <br />
          <span className="text-orange-400">в зал</span>
        </h1>
        <div className="mt-2 text-xs text-slate-500">{DEFAULT_PROGRAM.scheme}</div>
      </div>

      <div className="mb-4 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">Последняя</div>
            <div className="text-sm font-bold">{last?.label || 'Нет данных'}</div>
            {daysSince !== null ? (
              <div className={`mt-1 text-xs ${daysSince > 7 ? 'text-red-400' : 'text-green-400'}`}>
                {daysSince === 0 ? 'Сегодня' : `${daysSince} ${dayLabel(daysSince)} назад`}
              </div>
            ) : null}
          </div>
          <div className="text-right">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">Всего</div>
            <div className="text-2xl font-black text-orange-400">{history.length}</div>
          </div>
        </div>
        {daysSince !== null && daysSince > 7 ? (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-300">
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
            <span>Перерыв больше недели — начни с тех же весов, без прыжков</span>
          </div>
        ) : null}
      </div>

      {activeWorkout ? (
        <div className="mb-3 rounded-2xl border border-orange-500/40 bg-orange-500/10 p-4 shadow-lg shadow-orange-500/10">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-orange-300">Активная тренировка</div>
              <div className="text-sm font-bold text-slate-100">{activeWorkout.label}</div>
              <div className="mt-1 text-xs text-slate-400">
                Разминка: {activeWorkout.warmup.time} мин · {activeWorkout.warmup.distance} км
              </div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-bold text-slate-300">
              {(activeWorkout.currentEx ?? 0) + 1} / {activeProgram.exercises.length}
            </div>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 p-3 text-sm font-black uppercase tracking-wider text-black transition-all hover:bg-orange-400"
          >
            <Play size={16} fill="currentColor" />
            Продолжить тренировку
          </button>
        </div>
      ) : null}

      <div className="mb-5 space-y-2">
        <button
          type="button"
          onClick={() => requestStart('gym')}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-5 shadow-lg shadow-orange-500/20 transition-all hover:from-orange-400 hover:to-orange-500"
        >
          <Dumbbell size={24} />
          <span className="text-lg font-black uppercase tracking-wider">Начать зал</span>
        </button>
        <button
          type="button"
          onClick={() => requestStart('bodyweight')}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-green-500/40 bg-green-500/10 p-4 text-green-300 transition-all hover:bg-green-500/20"
        >
          <Activity size={22} />
          <span className="text-base font-black uppercase tracking-wider">Вне зала</span>
        </button>
      </div>

      {pendingStart ? (
        <div className="fixed inset-x-0 bottom-20 z-40 mx-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-orange-500/40 bg-slate-900 p-4 shadow-2xl shadow-black/50">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-orange-300">Заменить активную?</div>
              <div className="text-sm text-slate-300">
                Сейчас сохранена {activeWorkout?.label}. Новая тренировка заменит этот черновик.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPendingStart(null)}
              aria-label="Отмена"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPendingStart(null)}
              className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm font-bold text-slate-300"
            >
              Отмена
            </button>
            <button type="button" onClick={confirmStart} className="rounded-xl bg-orange-500 p-3 text-sm font-black text-black">
              Заменить
            </button>
          </div>
        </div>
      ) : null}

      {recommendations.length > 0 ? (
        <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            <div className="text-xs font-bold uppercase tracking-widest text-green-400">План на #{nextNum}</div>
          </div>
          <div className="space-y-2">
            {recommendations.map((rec) => (
              <div key={rec.name} className="flex items-center justify-between border-b border-slate-800 py-1.5 last:border-0">
                <div className="text-sm">{rec.name}</div>
                <div
                  className={`text-xs font-bold ${
                    rec.change === 'up' ? 'text-green-400' : rec.change === 'same' ? 'text-slate-400' : 'text-orange-400'
                  }`}
                >
                  {rec.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-slate-500">Последние тренировки</div>
      <div className="space-y-2">
        {history.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-500">История пустая</div>
        ) : (
          history
            .slice(-3)
            .reverse()
            .map((workout) => (
              <button
                key={workout.id}
                type="button"
                onClick={() => onView(workout)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3 transition-all hover:border-orange-500/50"
              >
                <div className="text-left">
                  <div className="text-sm font-bold">{workout.label}</div>
                  <div className="text-xs text-slate-500">{formatDate(workout.date)}</div>
                </div>
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            ))
        )}
      </div>
    </div>
  );
}
