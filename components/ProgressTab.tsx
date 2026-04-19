'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { exportUrl } from '@/lib/api';
import { formatShortDate } from '@/lib/format';
import { DEFAULT_PROGRAM } from '@/lib/program';
import type { Workout } from '@/lib/types';

interface ProgressTabProps {
  history: Workout[];
}

interface StatCardProps {
  label: string;
  value: number | string;
  color?: 'orange' | 'green' | 'slate';
}

function StatCard({ label, value, color = 'slate' }: StatCardProps) {
  const colors = { orange: 'text-orange-400', green: 'text-green-400', slate: 'text-slate-100' };
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
      <div className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">{label}</div>
      <div className={`text-xl font-black ${colors[color]}`}>{value}</div>
    </div>
  );
}

export default function ProgressTab({ history }: ProgressTabProps) {
  const [selectedEx, setSelectedEx] = useState('bench');

  const data = history.map((workout) => {
    const sets = workout.sets[selectedEx];
    const maxWeight = sets ? Math.max(...sets.map((set) => Number(set.w) || 0), 0) : 0;
    return { date: formatShortDate(workout.date), weight: maxWeight, label: workout.label };
  });

  const exercise = DEFAULT_PROGRAM.exercises.find((item) => item.id === selectedEx);
  const firstWeight = data[0]?.weight ?? 0;
  const lastWeight = data[data.length - 1]?.weight ?? 0;
  const progress = data.length > 1 ? lastWeight - firstWeight : null;

  return (
    <div className="p-4 pt-6">
      <h2 className="mb-4 text-2xl font-black uppercase tracking-wider">Прогресс</h2>

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-2">
        {DEFAULT_PROGRAM.exercises.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedEx(item.id)}
            className={`flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
              selectedEx === item.id ? 'bg-orange-500 text-black' : 'border border-slate-800 bg-slate-900 text-slate-400'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="mb-3">
          <div className="text-xs uppercase tracking-widest text-slate-500">Макс. вес</div>
          <div className="text-xl font-bold">{exercise?.name}</div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '10px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f97316' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ fill: '#f97316', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <StatCard label="Всего тренировок" value={history.length} />
        <StatCard label="Дней занятий" value={new Set(history.map((workout) => workout.date)).size} />
        <StatCard label="Рекорд" value={Math.max(...data.map((item) => item.weight), 0)} color="orange" />
        <StatCard label="Прогресс" value={progress !== null ? `${progress >= 0 ? '+' : ''}${progress}` : '—'} color="green" />
      </div>

      <button
        type="button"
        onClick={() => {
          window.location.href = exportUrl();
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/10 p-3 text-sm font-bold uppercase tracking-wider text-orange-300 transition-colors hover:bg-orange-500/20"
      >
        <Download size={16} />
        Экспорт CSV
      </button>
    </div>
  );
}
