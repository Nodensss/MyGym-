'use client';

import { useMemo, useState } from 'react';
import { ALL_EXERCISES } from '@/lib/program';
import type { Workout } from '@/lib/types';

interface RitualProgressProps {
  history: Workout[];
}

export default function RitualProgress({ history }: RitualProgressProps) {
  const [selectedEx, setSelectedEx] = useState('bench');
  const exercise = ALL_EXERCISES.find((e) => e.id === selectedEx) ?? ALL_EXERCISES[0];

  const data = useMemo(() => {
    return history
      .map((workout, idx) => {
        const sets = workout.sets[selectedEx];
        if (!sets?.length) return null;
        const value = exercise.noWeight
          ? sets.reduce((sum, s) => sum + (Number(s.r) || 0), 0)
          : Math.max(...sets.map((s) => Number(s.w) || 0), 0);
        if (value <= 0) return null;
        return { n: workout.number ?? idx + 1, value, date: workout.date };
      })
      .filter((v): v is { n: number; value: number; date: string } => Boolean(v));
  }, [history, selectedEx, exercise]);

  const startValue = data[0]?.value ?? 0;
  const peakValue = Math.max(...data.map((d) => d.value), 0);
  const delta = data.length > 1 ? data[data.length - 1].value - startValue : 0;
  const sessions = data.length;
  const unit = exercise.noWeight ? 'RAZ' : exercise.unit === 'плиток' ? 'PL' : 'KG';

  const minY = Math.min(...data.map((d) => d.value), peakValue);
  const maxY = peakValue;
  const yRange = Math.max(1, maxY - minY);

  const chartPoints = data.map((d, i) => {
    const x = data.length === 1 ? 0.5 : 0.05 + (i / (data.length - 1)) * 0.9;
    const y = (d.value - minY) / yRange;
    return { x, y, label: String(d.n), value: d.value };
  });

  const ticks = [0, 0.33, 0.66, 1].map((t) => Math.round(minY + t * yRange));

  return (
    <div
      className="ritual-scroll"
      style={{
        minHeight: '100dvh',
        overflowY: 'auto',
        paddingBottom: 120,
        padding: 'calc(env(safe-area-inset-top, 0px) + 60px) 24px 120px',
        background: 'var(--void)'
      }}
    >
      <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>progressus · iron</div>
      <div className="fraktur" style={{ fontSize: 54, lineHeight: 1, marginTop: 12, color: 'var(--bone)' }}>
        Ascent
      </div>
      <div style={{ margin: '14px 0 0', width: 32, height: 1, background: 'var(--bone)' }} />

      {/* exercise chooser */}
      <div
        className="ritual-scroll"
        style={{ marginTop: 28, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}
      >
        {ALL_EXERCISES.map((ex) => {
          const active = ex.id === selectedEx;
          return (
            <button
              key={ex.id}
              type="button"
              className="press"
              onClick={() => setSelectedEx(ex.id)}
              style={{
                padding: '7px 14px',
                flexShrink: 0,
                border: `1px solid ${active ? 'var(--ember)' : 'var(--bone-faint)'}`,
                background: active ? 'var(--ember)' : 'transparent',
                color: active ? 'var(--bone)' : 'var(--bone-dim)',
                borderRadius: 0
              }}
            >
              <span className="kaps-sm" style={{ fontSize: 8 }}>{ex.name}</span>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 36 }}>
        <div className="kaps-sm" style={{ color: 'var(--ember)' }}>{exercise.group.toLowerCase()}</div>
        <div
          className="script"
          style={{ fontSize: 14, color: 'var(--bone)', fontStyle: 'italic', marginTop: 4 }}
        >
          {exercise.name.toLowerCase()}
        </div>

        {data.length === 0 ? (
          <div
            className="script"
            style={{
              marginTop: 40,
              padding: 40,
              border: '1px solid var(--bone-faint)',
              textAlign: 'center',
              fontStyle: 'italic',
              color: 'var(--bone-dim)',
              fontSize: 13
            }}
          >
            no offerings yet recorded
          </div>
        ) : (
          <>
            <div
              style={{
                position: 'relative',
                height: 180,
                marginTop: 28,
                marginLeft: 30,
                borderLeft: '1px solid var(--bone-faint)',
                borderBottom: '1px solid var(--bone-faint)'
              }}
            >
              {ticks.map((val, i) => (
                <div
                  key={i}
                  className="mono"
                  style={{
                    position: 'absolute',
                    left: -30,
                    top: `${(1 - i / (ticks.length - 1)) * 100}%`,
                    fontSize: 9,
                    transform: 'translateY(-50%)',
                    color: 'var(--ash)'
                  }}
                >
                  {val}
                </div>
              ))}
              {[0.33, 0.66].map((t, i) => (
                <div
                  key={`grid-${i}`}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${(1 - t) * 100}%`,
                    height: 0,
                    borderTop: '1px dashed rgba(232,228,218,0.08)'
                  }}
                />
              ))}
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
              >
                {chartPoints.slice(0, -1).map((p, i) => {
                  const n = chartPoints[i + 1];
                  return (
                    <line
                      key={`line-${i}`}
                      x1={`${p.x * 100}%`}
                      y1={`${(1 - p.y) * 100}%`}
                      x2={`${n.x * 100}%`}
                      y2={`${(1 - n.y) * 100}%`}
                      stroke="var(--ember)"
                      strokeWidth={1}
                    />
                  );
                })}
              </svg>
              {chartPoints.map((p, i) => (
                <div
                  key={`pt-${i}`}
                  style={{
                    position: 'absolute',
                    left: `${p.x * 100}%`,
                    top: `${(1 - p.y) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 8,
                    height: 8,
                    background: 'var(--ember)',
                    border: '1px solid var(--bone)'
                  }}
                />
              ))}
              {chartPoints.map((p, i) => (
                <div
                  key={`lbl-${i}`}
                  className="mono"
                  style={{
                    position: 'absolute',
                    left: `${p.x * 100}%`,
                    bottom: -20,
                    transform: 'translateX(-50%)',
                    fontSize: 9,
                    color: 'var(--ash)'
                  }}
                >
                  {p.label}
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 40,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                border: '1px solid var(--bone-faint)'
              }}
            >
              {[
                { l: 'START', v: String(startValue), u: unit },
                { l: 'PEAK', v: String(peakValue), u: unit },
                { l: 'DELTA', v: `${delta >= 0 ? '+' : ''}${delta}`, u: unit },
                { l: 'SESSIONS', v: String(sessions), u: '' }
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: 16,
                    textAlign: 'center',
                    borderRight: i % 2 === 0 ? '1px solid var(--bone-faint)' : 'none',
                    borderBottom: i < 2 ? '1px solid var(--bone-faint)' : 'none'
                  }}
                >
                  <div className="kaps-sm" style={{ fontSize: 7, color: 'var(--ash)' }}>
                    {s.l}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--serif)',
                      fontWeight: 500,
                      fontSize: 28,
                      color: 'var(--bone)',
                      marginTop: 6
                    }}
                  >
                    {s.v}
                  </div>
                  {s.u ? (
                    <div
                      className="mono"
                      style={{ fontSize: 7, color: 'var(--ash)', letterSpacing: '0.2em', marginTop: 2 }}
                    >
                      {s.u}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <span className="cross-sm" style={{ color: 'var(--bone-dim)', display: 'inline-block' }} />
        <div className="script" style={{ fontSize: 11, color: 'var(--ash)', marginTop: 12, fontStyle: 'italic' }}>
          the ascent is slow. the ascent is certain.
        </div>
      </div>
    </div>
  );
}
