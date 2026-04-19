'use client';

import { useTheme } from '@/lib/theme-context';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isRitual = theme === 'ritual';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isRitual ? 'Переключить на обычный дизайн' : 'Переключить на ритуальный дизайн'}
      className="fixed right-3 top-3 z-50 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur transition-colors"
      style={
        isRitual
          ? {
              borderColor: 'rgba(232,228,218,0.35)',
              background: 'rgba(0,0,0,0.6)',
              color: '#E8E4DA',
              letterSpacing: '0.25em'
            }
          : {
              borderColor: 'rgba(249,115,22,0.5)',
              background: 'rgba(15,23,42,0.7)',
              color: '#fb923c'
            }
      }
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: isRitual ? '#8B1E1E' : '#f97316' }} />
      {isRitual ? 'Ritus' : 'Modern'}
    </button>
  );
}
