// Active.jsx — the rite in progress. Minimal, brutal, focused.

function ActiveScreen({ onOpen }) {
  const [exIdx, setExIdx] = React.useState(0);
  const [sets, setSets] = React.useState({
    0: [{ w: 30, r: 12, done: true }, { w: 30, r: 12, done: true }, { w: 30, r: 12, done: false }],
    1: [{ w: 6, r: 12, done: false }, { w: 6, r: 12, done: false }, { w: 6, r: 12, done: false }],
    2: [{ w: 3, r: 12, done: false }, { w: 3, r: 12, done: false }, { w: 3, r: 12, done: false }],
  });
  const [restTimer, setRestTimer] = React.useState(0);
  const [timerOn, setTimerOn] = React.useState(false);

  React.useEffect(() => {
    if (!timerOn) return;
    const i = setInterval(() => setRestTimer((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, [timerOn]);

  const exercises = [
    { name: 'Pressus Pectoris',  ru: 'жим штанги лёжа',   group: 'PECTUS',   target: '30', unit: 'КГ' },
    { name: 'Tractus Superior',  ru: 'тяга верхнего блока', group: 'DORSUM', target: '6',  unit: 'ПЛ' },
    { name: 'Tractus Horizon.',  ru: 'тяга горизонт. блока', group: 'DORSUM', target: '3', unit: 'ПЛ' },
  ];
  const ex = exercises[exIdx];
  const curSets = sets[exIdx];

  const roman = (n) => String(n).padStart(2, '0');
  const fmtTimer = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const update = (i, field, delta) => {
    setSets((s) => ({
      ...s,
      [exIdx]: s[exIdx].map((x, j) => j === i ? { ...x, [field]: Math.max(0, x[field] + delta) } : x),
    }));
  };
  const toggleDone = (i) => {
    setSets((s) => ({
      ...s,
      [exIdx]: s[exIdx].map((x, j) => j === i ? { ...x, done: !x.done } : x),
    }));
    setRestTimer(0);
    setTimerOn(true);
  };

  const progress = (exIdx + 1) / exercises.length;

  return (
    <div style={{ height: '100%', background: 'var(--void)', display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ padding: '70px 20px 0', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="press kaps-sm" onClick={() => onOpen('home')} style={{ color: 'var(--bone-dim)' }}>
            ✕ · cease
          </div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ember)' }}>
            <span className="ember-pulse">●</span> IN RITU
          </div>
          <div className="press kaps-sm" onClick={() => onOpen('home')} style={{ color: 'var(--bone)' }}>
            end ·✓
          </div>
        </div>

        {/* progress bar — carved */}
        <div style={{ marginTop: 24, height: 2, background: 'var(--bone-ghost)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: 'var(--ember)' }} />
          {exercises.map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: `${((i + 1) / exercises.length) * 100}%`,
              top: -3, width: 1, height: 8, background: 'var(--bone-faint)',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ash)' }}>EXERCISE {exIdx + 1}</div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ash)' }}>OF {exercises.length}</div>
        </div>
      </div>

      {/* exercise title */}
      <div style={{ padding: '36px 24px 0', textAlign: 'center' }}>
        <div className="kaps-sm" style={{ color: 'var(--ember)' }}>{ex.group}</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 500, fontSize: 34, lineHeight: 1, marginTop: 10, color: 'var(--bone)' }}>
          {ex.ru}
        </div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--ash)', marginTop: 8, letterSpacing: '0.25em' }}>
          {ex.name.toUpperCase()}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 18, alignItems: 'center' }}>
          <div style={{ height: 1, width: 20, background: 'var(--bone-faint)' }} />
          <div className="mono" style={{ fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.3em' }}>
            TARGET · {ex.target}·{ex.unit}
          </div>
          <div style={{ height: 1, width: 20, background: 'var(--bone-faint)' }} />
        </div>
      </div>

      {/* sets */}
      <div style={{ padding: '32px 20px 0', flex: 1 }}>
        {curSets.map((s, i) => (
          <div key={i} style={{
            padding: '16px 16px',
            marginBottom: 10,
            border: `1px solid ${s.done ? 'var(--ember-dim)' : 'var(--bone-faint)'}`,
            background: s.done ? 'var(--ember-glow)' : 'transparent',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr 1fr auto',
            gap: 12,
            alignItems: 'center',
          }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontSize: 20, color: s.done ? 'var(--ember)' : 'var(--bone)', width: 26, textAlign: 'center' }}>
              {i + 1}
            </div>
            <Stepper label="WEIGHT" value={s.w} unit={ex.unit} onDec={() => update(i, 'w', -2.5)} onInc={() => update(i, 'w', 2.5)} />
            <Stepper label="REPS"   value={s.r} unit="×"       onDec={() => update(i, 'r', -1)}   onInc={() => update(i, 'r', 1)} />
            <div
              className="press"
              onClick={() => toggleDone(i)}
              style={{
                width: 34, height: 34,
                border: `1px solid ${s.done ? 'var(--ember)' : 'var(--bone)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.done ? 'var(--ember)' : 'var(--bone)',
              }}
            >
              {s.done ? <span style={{ color: 'var(--ember)', fontSize: 18 }}>✓</span> : <span className="cross-sm" />}
            </div>
          </div>
        ))}
      </div>

      {/* rest timer */}
      <div
        className="press"
        onClick={() => { setTimerOn(!timerOn); if (timerOn) setRestTimer(0); }}
        style={{
          margin: '0 20px 14px',
          padding: '14px',
          border: `1px solid ${timerOn ? 'var(--ember)' : 'var(--bone-faint)'}`,
          textAlign: 'center',
        }}
      >
        <div className="kaps-sm" style={{ color: timerOn ? 'var(--ember)' : 'var(--ash)' }}>
          {timerOn ? 'silentium · rest' : 'begin rest'}
        </div>
        {timerOn ? (
          <div className="mono" style={{ fontSize: 28, color: 'var(--ember)', marginTop: 6, letterSpacing: '0.15em' }}>
            {fmtTimer(restTimer)}
          </div>
        ) : null}
      </div>

      {/* nav */}
      <div style={{ padding: '0 20px 90px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div
          className="press"
          onClick={() => exIdx > 0 && setExIdx(exIdx - 1)}
          style={{
            padding: 16, textAlign: 'center',
            border: '1px solid var(--bone-faint)',
            color: exIdx > 0 ? 'var(--bone)' : 'var(--bone-ghost)',
          }}
        >
          <span className="kaps-sm">← retro</span>
        </div>
        <div
          className="press"
          onClick={() => exIdx < exercises.length - 1 && setExIdx(exIdx + 1)}
          style={{
            padding: 16, textAlign: 'center',
            border: `1px solid ${exIdx < exercises.length - 1 ? 'var(--bone)' : 'var(--bone-faint)'}`,
            background: exIdx < exercises.length - 1 ? 'var(--bone)' : 'transparent',
            color: exIdx < exercises.length - 1 ? 'var(--void)' : 'var(--bone-ghost)',
          }}
        >
          <span className="kaps-sm">advance →</span>
        </div>
      </div>
    </div>
  );
}

function Stepper({ label, value, unit, onDec, onInc }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="kaps-sm" style={{ fontSize: 7, color: 'var(--ash)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
        <span className="press mono" onClick={onDec} style={{ color: 'var(--bone-dim)', fontSize: 16, width: 18 }}>−</span>
        <span className="mono" style={{ fontSize: 17, color: 'var(--bone)', minWidth: 34 }}>{value}</span>
        <span className="press mono" onClick={onInc} style={{ color: 'var(--bone-dim)', fontSize: 16, width: 18 }}>+</span>
      </div>
      <div className="mono" style={{ fontSize: 7, color: 'var(--ash)', marginTop: 2, letterSpacing: '0.2em' }}>{unit}</div>
    </div>
  );
}

window.ActiveScreen = ActiveScreen;
