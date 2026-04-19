'use client';

import { useEffect, useState } from 'react';
import { Check, Flame, Heart, Save, Timer, X } from 'lucide-react';
import { getProgramByKind } from '@/lib/program';
import type { Workout } from '@/lib/types';
import Stepper from '@/components/Stepper';

interface ActiveWorkoutProps {
  workout: Workout;
  setWorkout: (workout: Workout) => void;
  onFinish: (workout: Workout) => void;
  onPause: () => void;
  history: Workout[];
  saveStatus: '' | 'saved' | 'error';
}

function formatTimer(seconds: number) {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export default function ActiveWorkout({
  workout,
  setWorkout,
  onFinish,
  onPause,
  history,
  saveStatus
}: ActiveWorkoutProps) {
  const program = getProgramByKind(workout.kind);
  const currentEx = Math.min(workout.currentEx ?? 0, program.exercises.length - 1);
  const setCurrentEx = (next: number) => setWorkout({ ...workout, currentEx: next });
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const interval = window.setInterval(() => setTimer((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const exercise = program.exercises[currentEx];
  const lastWorkout = [...history].reverse().find((item) => item.sets[exercise.id]);
  const lastSets = lastWorkout?.sets[exercise.id];
  const exerciseSets =
    workout.sets[exercise.id] ??
    Array.from({ length: 3 }, () => ({
      w: exercise.noWeight ? 0 : exercise.defaultW,
      r: exercise.defaultR
    }));

  const updateSetField = (setIdx: number, field: 'w' | 'r', value: number) => {
    const newSets = [...exerciseSets];
    newSets[setIdx] = { ...newSets[setIdx], [field]: value };
    setWorkout({ ...workout, sets: { ...workout.sets, [exercise.id]: newSets } });
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimer(0);
  };

  return (
    <div className="active-workout-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-md">
        <div className="active-workout-header sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 pb-3 pt-2">
            {confirmCancel ? (
              <div className="flex min-w-28 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  className="min-h-11 rounded-lg px-2 py-1 text-xs text-slate-400"
                >
                  Вернуться
                </button>
                <button
                  type="button"
                  onClick={onPause}
                  className="min-h-11 rounded-lg border border-orange-500/40 bg-orange-500/20 px-3 py-1 text-xs text-orange-300"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                aria-label="Выйти из тренировки"
                className="flex h-12 min-w-12 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-900 hover:text-red-400"
              >
                <X size={26} />
              </button>
            )}
            <div className="min-w-0 flex-1 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-slate-500">
                <span>В процессе</span>
                {saveStatus === 'saved' ? (
                  <span className="flex items-center gap-0.5 text-green-400">
                    <Save size={10} /> сохр.
                  </span>
                ) : null}
                {saveStatus === 'error' ? <span className="text-red-400">offline</span> : null}
              </div>
              <div className="truncate text-sm font-bold">{workout.label}</div>
            </div>
            <button
              type="button"
              onClick={() => onFinish(workout)}
              className="min-h-11 min-w-28 rounded-lg border border-green-500/40 bg-green-500/20 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-green-400 hover:bg-green-500/30"
            >
              <Check size={14} className="mr-1 inline" />
              Готово
            </button>
          </div>
          <div className="h-1 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all"
              style={{ width: `${((currentEx + 1) / program.exercises.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4">
          {currentEx === 0 ? (
            <div className="mb-4 rounded-xl border-l-[3px] border-red-500 bg-gradient-to-br from-red-500/15 to-red-500/5 p-3">
              <div className="mb-2 flex items-center gap-2">
                <Flame size={14} className="text-red-400" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-red-400">Разминка</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">Время</div>
                  <Stepper
                    value={workout.warmup.time}
                    onChange={(value) => setWorkout({ ...workout, warmup: { ...workout.warmup, time: value } })}
                    step={1}
                    unit="мин"
                  />
                </div>
                <div>
                  <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">Дистанция</div>
                  <Stepper
                    value={workout.warmup.distance}
                    onChange={(value) => setWorkout({ ...workout, warmup: { ...workout.warmup, distance: value } })}
                    step={0.1}
                    unit="км"
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">
              {currentEx + 1} / {program.exercises.length}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-orange-400">{exercise.group}</div>
          </div>

          <div className="relative mb-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            {exercise.isNew ? (
              <div className="absolute right-3 top-3 rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-black">
                NEW
              </div>
            ) : null}
            <div className="mb-1 pr-10 text-xl font-bold">{exercise.name}</div>
            {exercise.hint ? <div className="mb-3 text-xs italic text-slate-400">{exercise.hint}</div> : null}

            <div className="mb-4 flex gap-2">
              <div className="flex-1 rounded-lg border border-green-500/30 bg-green-500/10 p-2">
                <div className="text-[9px] font-bold uppercase tracking-widest text-green-400">Цель</div>
                <div className="text-sm font-bold text-green-300">{exercise.target}</div>
              </div>
              {lastSets ? (
                <div className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 p-2">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">В прошлый раз</div>
                  <div className="text-sm font-bold text-slate-200">{lastSets.map((set) => set.w || '—').join('/')}</div>
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              {[0, 1, 2].map((setIdx) => (
                <div key={setIdx} className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-orange-400">Подход {setIdx + 1}</div>
                  <div className={`grid gap-2 ${exercise.noWeight ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {!exercise.noWeight ? (
                      <div>
                        <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">Вес</div>
                        <Stepper
                          value={exerciseSets[setIdx]?.w ?? 0}
                          onChange={(value) => updateSetField(setIdx, 'w', value)}
                          step={exercise.step}
                          unit={exercise.unit}
                        />
                      </div>
                    ) : null}
                    <div>
                      <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">Повторы</div>
                      <Stepper
                        value={exerciseSets[setIdx]?.r ?? 0}
                        onChange={(value) => updateSetField(setIdx, 'r', value)}
                        step={1}
                        unit="раз"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => (timerRunning ? setTimerRunning(false) : (setTimer(0), setTimerRunning(true)))}
            className={`mb-4 flex w-full items-center justify-center gap-2 rounded-xl p-3 transition-all ${
              timerRunning
                ? 'border border-blue-500/40 bg-blue-500/20 text-blue-300'
                : 'border border-slate-800 bg-slate-900 text-slate-400'
            }`}
          >
            <Timer size={16} />
            <span className="text-sm font-bold">{timerRunning ? `Отдых: ${formatTimer(timer)}` : 'Запустить таймер отдыха'}</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrentEx(Math.max(0, currentEx - 1));
                resetTimer();
              }}
              disabled={currentEx === 0}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 py-3 text-sm font-bold disabled:opacity-30"
            >
              ← Назад
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentEx < program.exercises.length - 1) {
                  setCurrentEx(currentEx + 1);
                  resetTimer();
                }
              }}
              disabled={currentEx === program.exercises.length - 1}
              className="flex-1 rounded-xl bg-orange-500 py-3 text-sm font-bold text-black disabled:opacity-30"
            >
              Далее →
            </button>
          </div>

          {currentEx === program.exercises.length - 1 ? (
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-3">
              <div className="mb-3 flex items-center gap-2">
                <Heart size={14} className="text-red-400" />
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Данные с часов</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">Время</div>
                  <Stepper
                    value={workout.watch?.duration ?? 0}
                    onChange={(value) => setWorkout({ ...workout, watch: { ...workout.watch!, duration: value } })}
                    step={5}
                    unit="мин"
                  />
                </div>
                <div>
                  <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">Калории</div>
                  <Stepper
                    value={workout.watch?.calories ?? 0}
                    onChange={(value) => setWorkout({ ...workout, watch: { ...workout.watch!, calories: value } })}
                    step={50}
                    unit="ккал"
                  />
                </div>
                <div>
                  <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">Пульс ср.</div>
                  <Stepper
                    value={workout.watch?.avgHr ?? 0}
                    onChange={(value) => setWorkout({ ...workout, watch: { ...workout.watch!, avgHr: value } })}
                    step={1}
                    unit="уд/мин"
                  />
                </div>
                <div>
                  <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500">Пульс макс.</div>
                  <Stepper
                    value={workout.watch?.maxHr ?? 0}
                    onChange={(value) => setWorkout({ ...workout, watch: { ...workout.watch!, maxHr: value } })}
                    step={1}
                    unit="уд/мин"
                  />
                </div>
              </div>
              <textarea
                placeholder="Заметки к тренировке..."
                value={workout.notes}
                onChange={(event) => setWorkout({ ...workout, notes: event.target.value })}
                rows={2}
                className="mt-3 w-full rounded border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
