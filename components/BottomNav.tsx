'use client';

import { Dumbbell, History, TrendingUp } from 'lucide-react';
import type { TabId } from '@/lib/types';

interface BottomNavProps {
  tab: TabId;
  setTab: (tab: TabId) => void;
}

const ITEMS = [
  { id: 'home' as const, icon: Dumbbell, label: 'Главная' },
  { id: 'history' as const, icon: History, label: 'История' },
  { id: 'progress' as const, icon: TrendingUp, label: 'Прогресс' }
];

export default function BottomNav({ tab, setTab }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-800 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                tab === item.id ? 'text-orange-400' : 'text-slate-500'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
