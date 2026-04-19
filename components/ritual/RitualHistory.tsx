'use client';

import { formatRitualDate, totalKgLifted } from '@/lib/ritual-helpers';
import type { Workout } from '@/lib/types';

interface RitualHistoryProps {
  history: Workout[];
  onView: (workout: Workout) => void;
}

export default function RitualHistory({ history, onView }: RitualHistoryProps) {
  const entries = [...history].reverse();

  return (
    <div
      className="ritual-scroll"
      style={{
        minHeight: '100dvh',
        overflowY: 'auto',
        paddingBottom: 120,
        background: 'var(--void)'
      }}
    >
      <div style={{ padding: 'calc(env(safe-area-inset-top, 0px) + 60px) 24px 0' }}>
        <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>chronicon · omnia</div>
        <div className="fraktur" style={{ fontSize: 54, lineHeight: 1, marginTop: 12, color: 'var(--bone)' }}>
          Chronicle
        </div>
        <div style={{ margin: '14px 0 0', width: 32, height: 1, background: 'var(--bone)' }} />
        <div className="script" style={{ fontSize: 13, color: 'var(--ash)', marginTop: 14, fontStyle: 'italic' }}>
          — every offering, inscribed in iron and shadow
        </div>
      </div>

      <div style={{ padding: '36px 0 0' }}>
        {entries.length === 0 ? (
          <div style={{ padding: '40px 24px', borderTop: '1px solid var(--bone-ghost)', textAlign: 'center' }}>
            <div className="script" style={{ fontSize: 13, color: 'var(--ash)', fontStyle: 'italic' }}>
              the chronicle standeth empty
            </div>
          </div>
        ) : (
          entries.map((workout) => {
            const kg = totalKgLifted(workout);
            const exCount = Object.values(workout.sets).filter((sets) => sets.some((set) => set.w > 0 || set.r > 0)).length;
            return (
              <button
                key={workout.id}
                type="button"
                className="press"
                onClick={() => onView(workout)}
                style={{
                  padding: '22px 24px',
                  borderTop: '1px solid var(--bone-ghost)',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 18,
                  alignItems: 'center',
                  width: '100%',
                  background: 'transparent',
                  border: 0,
                  borderTopWidth: 1,
                  borderTopStyle: 'solid',
                  borderTopColor: 'var(--bone-ghost)',
                  borderRadius: 0,
                  color: 'inherit',
                  textAlign: 'left'
                }}
              >
                <div style={{ textAlign: 'center', width: 50 }}>
                  <div
                    style={{
                      fontFamily: 'var(--serif)',
                      fontWeight: 500,
                      fontSize: 32,
                      color: 'var(--bone)',
                      lineHeight: 0.9
                    }}
                  >
                    {String(workout.number ?? 0).padStart(2, '0')}
                  </div>
                  <div className="mono" style={{ fontSize: 8, color: 'var(--ash)', marginTop: 4, letterSpacing: '0.1em' }}>
                    {formatRitualDate(workout.date)}
                  </div>
                </div>
                <div>
                  <div className="script" style={{ fontSize: 16, color: 'var(--bone)', fontStyle: 'italic' }}>
                    {workout.label}
                  </div>
                  <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
                    <div>
                      <div className="mono" style={{ fontSize: 15, color: 'var(--bone)' }}>
                        {kg}
                      </div>
                      <div className="mono" style={{ fontSize: 7, color: 'var(--ash)', letterSpacing: '0.2em' }}>
                        KG·LIFTED
                      </div>
                    </div>
                    <div style={{ width: 1, background: 'var(--bone-ghost)' }} />
                    <div>
                      <div className="mono" style={{ fontSize: 15, color: 'var(--bone)' }}>
                        {exCount}
                      </div>
                      <div className="mono" style={{ fontSize: 7, color: 'var(--ash)', letterSpacing: '0.2em' }}>
                        EXERCISES
                      </div>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div className="mono ember" style={{ fontSize: 8, alignSelf: 'center' }}>
                      COMPLETE
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
        {entries.length > 0 ? <div style={{ borderTop: '1px solid var(--bone-ghost)' }} /> : null}
      </div>

      <div style={{ padding: '48px 24px 0', textAlign: 'center' }}>
        <span className="cross-sm" style={{ color: 'var(--bone-dim)', display: 'inline-block' }} />
        <div
          className="script"
          style={{ fontSize: 11, color: 'var(--ash)', marginTop: 12, fontStyle: 'italic' }}
        >
          here endeth the chronicle
        </div>
      </div>
    </div>
  );
}
