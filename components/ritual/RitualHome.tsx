'use client';

import { useState } from 'react';
import RitualFigure from '@/components/ritual/RitualFigure';
import {
  computeMuscleIntensity,
  computePRs,
  daysBetween,
  formatRitualDate,
  getCalendarMonth,
  totalKgLifted
} from '@/lib/ritual-helpers';
import type { Workout, WorkoutKind } from '@/lib/types';

interface RitualHomeProps {
  history: Workout[];
  activeWorkout: Workout | null;
  onStart: (kind: WorkoutKind) => void;
  onContinue: () => void;
  onView: (workout: Workout) => void;
}

export default function RitualHome({ history, activeWorkout, onStart, onContinue, onView }: RitualHomeProps) {
  const [pendingStart, setPendingStart] = useState<WorkoutKind | null>(null);
  const today = new Date();
  const todayIso = today.toLocaleDateString('sv-SE');
  const last = history[history.length - 1];
  const daysSince = last ? daysBetween(last.date, todayIso) : null;
  const nextNum = Math.max(0, ...history.map((w) => w.number ?? 0)) + 1;
  const intensity = computeMuscleIntensity(history);
  const prs = computePRs(history);
  const calendar = getCalendarMonth(history);

  const requestStart = (kind: WorkoutKind) => {
    if (activeWorkout) setPendingStart(kind);
    else onStart(kind);
  };

  const confirmStart = () => {
    if (!pendingStart) return;
    onStart(pendingStart);
    setPendingStart(null);
  };

  const recent = [...history].slice(-3).reverse();

  return (
    <div
      className="ritual-scroll"
      style={{
        minHeight: '100dvh',
        overflowY: 'auto',
        background: 'var(--void)',
        paddingBottom: 120
      }}
    >
      {/* I. void above */}
      <div style={{ height: 96, position: 'relative', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div style={{ position: 'absolute', top: 62, left: 24, right: 24, height: 1, background: 'rgba(232,228,218,0.15)' }} />
        <div
          className="mono rise"
          style={{ position: 'absolute', top: 70, left: 24, fontSize: 9, color: 'var(--bone-dim)' }}
        >
          {formatRitualDate(todayIso)}
        </div>
        <div
          className="rise"
          style={{ position: 'absolute', top: 70, right: 24, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span className="cross-sm" style={{ color: 'var(--ember)' }} />
          <span className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)' }}>
            SESSION · {nextNum}
          </span>
        </div>
      </div>

      {/* II. title */}
      <div className="rise rise-2" style={{ padding: '0 24px', textAlign: 'center', marginTop: 8 }}>
        <div className="fraktur" style={{ fontSize: 72, lineHeight: 0.88, color: 'var(--bone)', letterSpacing: '0.02em' }}>
          Mÿ Gÿm
        </div>
        <div style={{ margin: '18px auto 0', width: 48, height: 1, background: 'var(--bone)' }} />
        <div className="kaps-sm rise rise-3" style={{ marginTop: 14, color: 'var(--bone-dim)' }}>
          a liturgy of iron · full body
        </div>
      </div>

      {/* III. days since last rite */}
      <div className="rise rise-3" style={{ padding: '48px 24px 0', textAlign: 'center' }}>
        <div className="kaps-sm" style={{ color: 'var(--ash)' }}>
          {daysSince === null ? 'awaiting the first rite' : 'days since last rite'}
        </div>
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontWeight: 500,
            fontSize: 108,
            lineHeight: 0.9,
            marginTop: 10,
            color: 'var(--ember)',
            fontFeatureSettings: '"onum"'
          }}
        >
          {daysSince ?? '—'}
        </div>
        <div className="script" style={{ fontSize: 13, color: 'var(--bone-dim)', marginTop: 12, fontStyle: 'italic' }}>
          {daysSince === null
            ? '― the altar is yet untouched'
            : daysSince === 0
              ? '― the iron still warm, a fresh offering'
              : daysSince > 7
                ? `― ${daysSince} days in exile from the altar`
                : `― ${daysSince} days since last offering`}
        </div>
      </div>

      {/* Active workout — continue */}
      {activeWorkout ? (
        <div className="rise rise-4" style={{ padding: '32px 24px 0' }}>
          <div
            className="press"
            onClick={onContinue}
            style={{
              position: 'relative',
              padding: '22px 20px',
              border: '1px solid var(--ember)',
              background: 'var(--ember-glow)',
              textAlign: 'center'
            }}
          >
            <div className="kaps-sm" style={{ color: 'var(--ember)' }}>
              rite in progress
            </div>
            <div
              className="fraktur"
              style={{ fontSize: 32, lineHeight: 0.9, marginTop: 10, color: 'var(--bone)' }}
            >
              Continue
            </div>
            <div
              className="script"
              style={{ fontSize: 12, color: 'var(--bone-dim)', marginTop: 8, fontStyle: 'italic' }}
            >
              ― {activeWorkout.label}
            </div>
          </div>
        </div>
      ) : null}

      {/* IV. sacrament button */}
      <div className="rise rise-4" style={{ padding: activeWorkout ? '14px 24px 0' : '40px 24px 0' }}>
        <div
          className="press"
          onClick={() => requestStart('gym')}
          style={{
            position: 'relative',
            padding: '32px 20px',
            border: '1px solid var(--bone)',
            background: 'var(--void)',
            textAlign: 'center',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderLeft: '1px solid var(--bone)', borderTop: '1px solid var(--bone)' }} />
          <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderRight: '1px solid var(--bone)', borderTop: '1px solid var(--bone)' }} />
          <div style={{ position: 'absolute', bottom: 6, left: 6, width: 10, height: 10, borderLeft: '1px solid var(--bone)', borderBottom: '1px solid var(--bone)' }} />
          <div style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderRight: '1px solid var(--bone)', borderBottom: '1px solid var(--bone)' }} />

          <div className="kaps-sm" style={{ color: 'var(--ash)' }}>enter the rite</div>
          <div className="fraktur" style={{ fontSize: 44, lineHeight: 0.9, marginTop: 14, color: 'var(--bone)' }}>
            Begin
          </div>
          <div className="script ember-pulse" style={{ fontSize: 13, color: 'var(--ember-dim)', marginTop: 10, fontStyle: 'italic' }}>
            ― lift, that the iron may know thee
          </div>
        </div>

        <div
          className="press"
          onClick={() => requestStart('bodyweight')}
          style={{
            marginTop: 10,
            textAlign: 'center',
            padding: 14,
            border: '1px solid var(--bone-faint)',
            color: 'var(--bone-dim)'
          }}
        >
          <span className="kaps-sm">or · without the altar · bodyweight</span>
        </div>
      </div>

      {/* V. anatomical figure */}
      <div className="rise rise-4" style={{ padding: '64px 0 0', position: 'relative' }}>
        <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>figura · anatomica</div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ash)' }}>7 · DAYS</div>
        </div>
        <div className="rule-dim" style={{ margin: '0 24px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, padding: '20px 16px 0', alignItems: 'start' }}>
          <div style={{ paddingTop: 18, textAlign: 'right' }}>
            <LegendRow name="PECTUS" ru="грудь" v={intensity.chest ?? 0} />
            <LegendRow name="DORSUM" ru="спина" v={intensity.back ?? 0} />
            <LegendRow name="HUMERI" ru="плечи" v={intensity.shoulders ?? 0} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <RitualFigure intensity={intensity} size={150} />
          </div>
          <div style={{ paddingTop: 18 }}>
            <LegendRow name="BRACHIUM" ru="руки" v={intensity.arms ?? 0} align="left" />
            <LegendRow name="ABDOMEN" ru="пресс" v={intensity.core ?? 0} align="left" />
            <LegendRow name="CRUS" ru="ноги" v={intensity.legs ?? 0} align="left" />
          </div>
        </div>

        <div
          className="script"
          style={{ textAlign: 'center', padding: '12px 40px 0', fontSize: 12, color: 'var(--bone-dim)', fontStyle: 'italic', lineHeight: 1.4 }}
        >
          that which bleedeth, groweth.
          <br />
          <span style={{ color: 'var(--ash)', fontSize: 10 }}>― sum of offerings, seven days</span>
        </div>
      </div>

      {/* VI. liturgical calendar */}
      <div className="rise rise-5" style={{ padding: '56px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>kalendarium · {calendar.monthName}</div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ash)' }}>
            {calendar.workedCount} / {calendar.daysInMonth}
          </div>
        </div>
        <div className="rule-dim" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, padding: '14px 0 6px' }}>
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <div key={i} className="mono" style={{ fontSize: 8, color: 'var(--ash)', textAlign: 'center' }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {Array.from({ length: calendar.offset }).map((_, i) => (
            <div key={`empty-${i}`} style={{ aspectRatio: '1 / 1' }} />
          ))}
          {calendar.days.map((d) => (
            <div
              key={d.d}
              style={{
                aspectRatio: '1 / 1',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: d.today ? '1px solid var(--ember)' : 'none'
              }}
            >
              {d.worked ? (
                <div style={{ position: 'absolute', inset: '22%', background: 'var(--ember)', opacity: 0.9 }} />
              ) : null}
              <div
                className="mono"
                style={{
                  fontSize: 9,
                  position: 'relative',
                  zIndex: 1,
                  color: d.worked ? 'var(--bone)' : d.today ? 'var(--ember)' : 'var(--bone-ghost)',
                  fontWeight: d.today ? 500 : 300
                }}
              >
                {d.d}
              </div>
            </div>
          ))}
        </div>
        <div
          className="script"
          style={{ textAlign: 'center', padding: '16px 40px 0', fontSize: 11, color: 'var(--ash)', fontStyle: 'italic' }}
        >
          {calendar.workedCount} offerings · {calendar.daysInMonth - calendar.workedCount} abstentions
        </div>
      </div>

      {/* VII. PRs */}
      {prs.length > 0 ? (
        <div className="rise rise-5" style={{ padding: '56px 24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>sigilla · records</div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--ash)' }}>
              {prs.length} · RECORDS
            </div>
          </div>
          <div className="rule-dim" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
            {prs.map((pr) => (
              <Tablet key={pr.id} pr={pr} />
            ))}
          </div>
        </div>
      ) : null}

      {/* VIII. history procession */}
      {recent.length > 0 ? (
        <div className="rise rise-6" style={{ padding: '56px 0 0' }}>
          <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
            <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>chronicon</div>
            <div className="mono" style={{ fontSize: 9, color: 'var(--ash)' }}>
              {recent.length} · ENTRIES
            </div>
          </div>
          <div className="rule-dim" style={{ margin: '0 24px' }} />
          <div style={{ padding: '8px 0' }}>
            {recent.map((workout, i) => {
              const kg = totalKgLifted(workout);
              const maxKg = Math.max(...recent.map((w) => totalKgLifted(w)), 1);
              return (
                <button
                  key={workout.id}
                  type="button"
                  className="press"
                  onClick={() => onView(workout)}
                  style={{
                    padding: '18px 24px',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto auto',
                    gap: 14,
                    alignItems: 'center',
                    width: '100%',
                    borderBottom: i < recent.length - 1 ? '1px solid var(--bone-ghost)' : 'none',
                    background: 'transparent',
                    border: 0,
                    borderRadius: 0,
                    color: 'inherit',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 24, color: 'var(--bone)', width: 32 }}>
                    {String(workout.number ?? i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="script" style={{ fontSize: 14, color: 'var(--bone)', fontStyle: 'italic' }}>
                      {workout.label}
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 9, color: 'var(--ash)', marginTop: 2, letterSpacing: '0.15em' }}
                    >
                      {formatRitualDate(workout.date)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 13, color: 'var(--bone)' }}>
                      {kg}
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 7.5, color: 'var(--ash)', marginTop: 2, letterSpacing: '0.2em' }}
                    >
                      KG·LIFTED
                    </div>
                  </div>
                  <div style={{ width: 3, height: 38, background: 'var(--ember)', opacity: Math.min(1, 0.15 + (kg / maxKg) * 0.85) }} />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* IX. litany footer */}
      <div className="rise rise-6" style={{ padding: '72px 24px 40px', textAlign: 'center' }}>
        <div className="cross-sm" style={{ color: 'var(--bone-dim)', display: 'inline-block' }} />
        <div
          className="script"
          style={{ fontSize: 12, color: 'var(--ash)', marginTop: 16, lineHeight: 1.7, fontStyle: 'italic' }}
        >
          the iron doth not forget.
          <br />
          the iron doth not forgive.
          <br />
          the iron remembereth all.
        </div>
        <div
          className="mono"
          style={{ fontSize: 8, color: 'var(--bone-ghost)', marginTop: 22, letterSpacing: '0.3em' }}
        >
          MYGYM · MMXXVI
        </div>
      </div>

      {/* Confirm replace active */}
      {pendingStart ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.78)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}
        >
          <div
            style={{
              maxWidth: 360,
              width: '100%',
              padding: '24px 22px',
              border: '1px solid var(--bone-faint)',
              background: 'var(--void)',
              textAlign: 'center'
            }}
          >
            <div className="kaps-sm" style={{ color: 'var(--ember)' }}>replace the rite?</div>
            <div
              className="script"
              style={{ fontSize: 14, marginTop: 12, color: 'var(--bone-dim)', fontStyle: 'italic' }}
            >
              {activeWorkout?.label ?? 'active'} shall be forsaken
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                className="press"
                onClick={() => setPendingStart(null)}
                style={{
                  padding: 14,
                  border: '1px solid var(--bone-faint)',
                  background: 'transparent',
                  color: 'var(--bone)',
                  borderRadius: 0
                }}
              >
                <span className="kaps-sm">nay</span>
              </button>
              <button
                type="button"
                className="press"
                onClick={confirmStart}
                style={{
                  padding: 14,
                  border: '1px solid var(--ember)',
                  background: 'var(--ember)',
                  color: 'var(--bone)',
                  borderRadius: 0
                }}
              >
                <span className="kaps-sm">replace</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LegendRow({ name, ru, v, align = 'right' }: { name: string; ru: string; v: number; align?: 'left' | 'right' }) {
  const opacity = 0.25 + Math.min(1, Math.max(0, v)) * 0.75;
  return (
    <div
      style={{
        marginBottom: 14,
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'right' ? 'flex-end' : 'flex-start'
      }}
    >
      <div className="kaps-sm" style={{ color: 'var(--bone)', opacity, fontSize: 9 }}>
        {name}
      </div>
      <div
        style={{
          marginTop: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexDirection: align === 'right' ? 'row' : 'row-reverse'
        }}
      >
        <div className="script" style={{ fontSize: 10, color: 'var(--ash)', fontStyle: 'italic' }}>
          {ru}
        </div>
        <div
          style={{
            width: 18,
            height: 4,
            background: v > 0 ? `rgba(139,30,30,${0.2 + v * 0.8})` : 'rgba(232,228,218,0.08)'
          }}
        />
      </div>
    </div>
  );
}

function Tablet({ pr }: { pr: { name: string; value: string; unit: string; count: number } }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: '16px 14px',
        border: '1px solid var(--bone-faint)',
        textAlign: 'center'
      }}
    >
      <div style={{ position: 'absolute', top: 3, left: 3, width: 2, height: 2, background: 'var(--bone)' }} />
      <div style={{ position: 'absolute', top: 3, right: 3, width: 2, height: 2, background: 'var(--bone)' }} />
      <div style={{ position: 'absolute', bottom: 3, left: 3, width: 2, height: 2, background: 'var(--bone)' }} />
      <div style={{ position: 'absolute', bottom: 3, right: 3, width: 2, height: 2, background: 'var(--bone)' }} />

      <div className="kaps-sm" style={{ color: 'var(--ash)', fontSize: 8 }}>
        {pr.name}
      </div>
      <div
        style={{
          fontFamily: 'var(--serif)',
          fontWeight: 500,
          fontSize: 44,
          lineHeight: 1,
          margin: '10px 0 4px',
          color: 'var(--bone)'
        }}
      >
        {pr.value}
      </div>
      <div className="mono" style={{ fontSize: 8, color: 'var(--bone-dim)', letterSpacing: '0.25em' }}>
        {pr.unit}
      </div>
      <div style={{ marginTop: 8, height: 1, background: 'var(--bone-ghost)' }} />
      <div className="mono" style={{ fontSize: 8, color: 'var(--ember-dim)', marginTop: 8, letterSpacing: '0.2em' }}>
        PR · {pr.count}
      </div>
    </div>
  );
}
