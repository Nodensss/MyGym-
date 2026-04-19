'use client';

import type { TabId } from '@/lib/types';

interface RitualTabBarProps {
  tab: TabId;
  setTab: (tab: TabId) => void;
}

const ITEMS: Array<{ id: TabId; label: string }> = [
  { id: 'home', label: 'ALTARE' },
  { id: 'history', label: 'CHRONICON' },
  { id: 'progress', label: 'ASCENSUS' }
];

export default function RitualTabBar({ tab, setTab }: RitualTabBarProps) {
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 30,
        background: 'linear-gradient(to top, var(--void) 60%, transparent)',
        paddingTop: 20,
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)'
      }}
    >
      <div
        style={{
          margin: '0 20px',
          maxWidth: 420,
          marginInline: 'auto',
          borderTop: '1px solid var(--bone-faint)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)'
        }}
      >
        {ITEMS.map((item, idx) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className="press"
              onClick={() => setTab(item.id)}
              style={{
                padding: '14px 8px 10px',
                textAlign: 'center',
                borderRight: idx < ITEMS.length - 1 ? '1px solid var(--bone-ghost)' : 'none',
                position: 'relative',
                background: 'transparent',
                border: 'none',
                borderRadius: 0,
                color: 'inherit'
              }}
            >
              {active && (
                <div
                  style={{
                    position: 'absolute',
                    top: -1,
                    left: '30%',
                    right: '30%',
                    height: 1,
                    background: 'var(--ember)'
                  }}
                />
              )}
              <div
                className="kaps-sm"
                style={{
                  color: active ? 'var(--bone)' : 'var(--ash)',
                  fontSize: 8
                }}
              >
                {item.label}
              </div>
              {active && (
                <div style={{ marginTop: 6 }}>
                  <span className="cross-sm" style={{ color: 'var(--ember)', display: 'inline-block' }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
