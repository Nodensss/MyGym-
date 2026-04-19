'use client';

import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
}

export default function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 999,
  unit = ''
}: StepperProps) {
  const num = Number(value) || 0;
  const inc = () => onChange(Math.min(max, Math.round((num + step) * 100) / 100));
  const dec = () => onChange(Math.max(min, Math.round((num - step) * 100) / 100));

  return (
    <div className="flex h-9 items-center gap-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
      <button
        type="button"
        onClick={dec}
        aria-label="Уменьшить"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-slate-800 text-orange-400 transition-colors hover:bg-slate-700 active:bg-slate-600"
      >
        <Minus size={16} strokeWidth={2.5} />
      </button>
      <div className="min-w-12 flex-1 py-1 text-center">
        <div className="text-base font-bold leading-tight text-slate-100">{num}</div>
        {unit ? <div className="text-[9px] uppercase leading-none tracking-wider text-slate-500">{unit}</div> : null}
      </div>
      <button
        type="button"
        onClick={inc}
        aria-label="Увеличить"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-slate-800 text-orange-400 transition-colors hover:bg-slate-700 active:bg-slate-600"
      >
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
