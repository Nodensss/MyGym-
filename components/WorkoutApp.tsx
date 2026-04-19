'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clearActive,
  createWorkout,
  deleteWorkout as deleteWorkoutRequest,
  fetchActive,
  fetchWorkouts,
  saveActive
} from '@/lib/api';
import { INITIAL_HISTORY } from '@/lib/fallback-data';
import { DEFAULT_PROGRAM } from '@/lib/program';
import type { TabId, Workout } from '@/lib/types';
import ActiveWorkout from '@/components/ActiveWorkout';
import BottomNav from '@/components/BottomNav';
import HistoryTab from '@/components/HistoryTab';
import HomeTab from '@/components/HomeTab';
import ProgressTab from '@/components/ProgressTab';
import WorkoutDetail from '@/components/WorkoutDetail';

const HISTORY_CACHE_KEY = 'slavik_gym_history_cache';
const ACTIVE_CACHE_KEY = 'slavik_gym_active_cache';

type SaveStatus = '' | 'saved' | 'error';

function readJson<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local fallback should never break the screen.
  }
}

function removeJson(key: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Local fallback should never break the screen.
  }
}

function todayIso() {
  return new Date().toLocaleDateString('sv-SE');
}

function getNextWorkoutNumber(history: Workout[]) {
  return Math.max(0, ...history.map((workout) => workout.number ?? Number(workout.label.match(/\d+/)?.[0] ?? 0))) + 1;
}

function sortHistory(history: Workout[]) {
  return [...history].sort((a, b) => a.date.localeCompare(b.date));
}

function stripActiveFields(workout: Workout): Workout {
  const cleaned = { ...workout };
  delete cleaned.currentEx;
  return cleaned;
}

export default function WorkoutApp() {
  const [tab, setTab] = useState<TabId>('home');
  const [history, setHistory] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [viewingWorkout, setViewingWorkout] = useState<Workout | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('');
  const [toast, setToast] = useState('');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaveErrorAtRef = useRef(0);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(''), 3200);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [serverHistory, serverActive] = await Promise.all([fetchWorkouts(), fetchActive()]);
        if (!mounted) return;

        const sorted = sortHistory(serverHistory);
        setHistory(sorted);
        writeJson(HISTORY_CACHE_KEY, sorted);

        if (serverActive) {
          setActiveWorkout(serverActive);
          writeJson(ACTIVE_CACHE_KEY, serverActive);
        } else {
          removeJson(ACTIVE_CACHE_KEY);
        }
      } catch {
        if (!mounted) return;
        const cachedHistory = readJson<Workout[]>(HISTORY_CACHE_KEY);
        const cachedActive = readJson<Workout>(ACTIVE_CACHE_KEY);
        setHistory(sortHistory(cachedHistory?.length ? cachedHistory : INITIAL_HISTORY));
        if (cachedActive) setActiveWorkout(cachedActive);
        showToast('Нет связи с сервером, открыта локальная копия');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [showToast]);

  useEffect(() => {
    if (loading) return undefined;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        if (activeWorkout) {
          await saveActive(activeWorkout);
          writeJson(ACTIVE_CACHE_KEY, activeWorkout);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus(''), 1500);
        } else {
          await clearActive();
          removeJson(ACTIVE_CACHE_KEY);
        }
      } catch {
        if (activeWorkout) writeJson(ACTIVE_CACHE_KEY, activeWorkout);
        else removeJson(ACTIVE_CACHE_KEY);

        setSaveStatus('error');
        const now = Date.now();
        if (activeWorkout && now - lastSaveErrorAtRef.current > 5000) {
          showToast('Автосохранение ушло в localStorage');
          lastSaveErrorAtRef.current = now;
        }
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [activeWorkout, loading, showToast]);

  const updateHistory = (nextHistory: Workout[]) => {
    const sorted = sortHistory(nextHistory);
    setHistory(sorted);
    writeJson(HISTORY_CACHE_KEY, sorted);
  };

  const startNewWorkout = () => {
    const nextNumber = getNextWorkoutNumber(history);
    const lastWorkout = history[history.length - 1];

    const newWorkout: Workout = {
      id: `local-${Date.now()}`,
      number: nextNumber,
      date: todayIso(),
      label: `Тренировка #${nextNumber}`,
      warmup: { time: 10, distance: 1 },
      sets: Object.fromEntries(
        DEFAULT_PROGRAM.exercises.map((exercise) => {
          const lastSets = lastWorkout?.sets[exercise.id];
          const baseW = exercise.noWeight
            ? 0
            : lastSets
              ? Math.max(...lastSets.map((set) => Number(set.w) || 0), 0)
              : exercise.defaultW;
          const baseR = lastSets?.[0]?.r ? Number(lastSets[0].r) : exercise.defaultR;
          return [
            exercise.id,
            [
              { w: baseW, r: baseR },
              { w: baseW, r: baseR },
              { w: baseW, r: baseR }
            ]
          ];
        })
      ),
      watch: { duration: 0, calories: 0, avgHr: 0, maxHr: 0 },
      notes: '',
      currentEx: 0
    };

    setActiveWorkout(newWorkout);
  };

  const finishWorkout = async (workout: Workout) => {
    const cleaned = stripActiveFields(workout);

    try {
      const saved = await createWorkout(cleaned);
      updateHistory([...history, saved]);
      try {
        await clearActive();
      } catch {
        showToast('Тренировка сохранена, активная запись очистится позже');
      }
      removeJson(ACTIVE_CACHE_KEY);
    } catch {
      updateHistory([...history, cleaned]);
      removeJson(ACTIVE_CACHE_KEY);
      showToast('Сервер недоступен, тренировка сохранена локально');
    }

    setActiveWorkout(null);
    setTab('history');
  };

  const cancelWorkout = async () => {
    try {
      await clearActive();
    } catch {
      showToast('Активная тренировка удалена локально');
    }
    removeJson(ACTIVE_CACHE_KEY);
    setActiveWorkout(null);
  };

  const deleteWorkout = async (id: string) => {
    if (id.startsWith('local-')) {
      updateHistory(history.filter((workout) => workout.id !== id));
      setViewingWorkout(null);
      return;
    }

    try {
      await deleteWorkoutRequest(id);
      updateHistory(history.filter((workout) => workout.id !== id));
      setViewingWorkout(null);
    } catch {
      showToast('Не удалось удалить тренировку на сервере');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="animate-pulse text-orange-400">Загрузка...</div>
      </div>
    );
  }

  if (activeWorkout) {
    return (
      <>
        <ActiveWorkout
          workout={activeWorkout}
          setWorkout={setActiveWorkout}
          onFinish={finishWorkout}
          onCancel={cancelWorkout}
          history={history}
          saveStatus={saveStatus}
        />
        {toast ? <Toast message={toast} /> : null}
      </>
    );
  }

  if (viewingWorkout) {
    return (
      <>
        <WorkoutDetail
          workout={viewingWorkout}
          onBack={() => setViewingWorkout(null)}
          onDelete={() => deleteWorkout(viewingWorkout.id)}
        />
        {toast ? <Toast message={toast} /> : null}
      </>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 pb-20 text-slate-100"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at top left, rgba(249,115,22,0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(56,189,248,0.05) 0%, transparent 50%)'
      }}
    >
      <div className="mx-auto max-w-md">
        {tab === 'home' ? <HomeTab history={history} onStart={startNewWorkout} onView={setViewingWorkout} /> : null}
        {tab === 'history' ? <HistoryTab history={history} onView={setViewingWorkout} /> : null}
        {tab === 'progress' ? <ProgressTab history={history} /> : null}
      </div>
      <BottomNav tab={tab} setTab={setTab} />
      {toast ? <Toast message={toast} /> : null}
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-orange-500/30 bg-slate-900 px-4 py-3 text-sm text-orange-100 shadow-xl shadow-black/30">
      {message}
    </div>
  );
}
