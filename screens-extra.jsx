// History + placeholder screens
function HistoryScreen({ onOpen }) {
  const entries = [
    { n: 3, date: '11 APR 2026', label: 'training the third',  weight: 3250, ex: 7, status: 'COMPLETE' },
    { n: 2, date: '07 APR 2026', label: 'training the second', weight: 2880, ex: 7, status: 'COMPLETE' },
    { n: 1, date: '01 APR 2026', label: 'training the first',  weight: 2340, ex: 7, status: 'COMPLETE' },
  ];
  const roman = (n) => ['I','II','III','IV','V','VI','VII'][n - 1] || String(n);
  return (
    <div className="ritual-scroll" style={{ height: '100%', overflowY: 'auto', paddingBottom: 100 }}>
      <div style={{ padding: '70px 24px 0' }}>
        <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>chronicon · omnia</div>
        <div className="fraktur" style={{ fontSize: 54, lineHeight: 1, marginTop: 12, color: 'var(--bone)' }}>Chronicle</div>
        <div style={{ margin: '14px 0 0', width: 32, height: 1, background: 'var(--bone)' }} />
        <div className="script" style={{ fontSize: 13, color: 'var(--ash)', marginTop: 14, fontStyle: 'italic' }}>
          — every offering, inscribed in iron and shadow
        </div>
      </div>

      <div style={{ padding: '36px 0 0' }}>
        {entries.map((e) => (
          <div key={e.n} className="press" onClick={() => onOpen('home')} style={{
            padding: '22px 24px',
            borderTop: '1px solid var(--bone-ghost)',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 18,
            alignItems: 'center',
          }}>
            <div style={{ textAlign: 'center', width: 50 }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontSize: 32, color: 'var(--bone)', lineHeight: 0.9 }}>{String(e.n).padStart(2, '0')}</div>
              <div className="mono" style={{ fontSize: 8, color: 'var(--ash)', marginTop: 4, letterSpacing: '0.1em' }}>{e.date}</div>
            </div>
            <div>
              <div className="script" style={{ fontSize: 16, color: 'var(--bone)', fontStyle: 'italic' }}>{e.label}</div>
              <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
                <div>
                  <div className="mono" style={{ fontSize: 15, color: 'var(--bone)' }}>{e.weight}</div>
                  <div className="mono" style={{ fontSize: 7, color: 'var(--ash)', letterSpacing: '0.2em' }}>KG·LIFTED</div>
                </div>
                <div style={{ width: 1, background: 'var(--bone-ghost)' }} />
                <div>
                  <div className="mono" style={{ fontSize: 15, color: 'var(--bone)' }}>{e.ex}</div>
                  <div className="mono" style={{ fontSize: 7, color: 'var(--ash)', letterSpacing: '0.2em' }}>EXERCISES</div>
                </div>
                <div style={{ flex: 1 }} />
                <div className="mono ember" style={{ fontSize: 8, alignSelf: 'center' }}>{e.status}</div>
              </div>
            </div>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--bone-ghost)' }} />
      </div>

      <div style={{ padding: '48px 24px 0', textAlign: 'center' }}>
        <span className="cross-sm" style={{ color: 'var(--bone-dim)', display: 'inline-block' }} />
        <div className="script" style={{ fontSize: 11, color: 'var(--ash)', marginTop: 12, fontStyle: 'italic' }}>
          here endeth the chronicle
        </div>
      </div>
    </div>
  );
}

function ProgressScreen({ onOpen }) {
  return (
    <div className="ritual-scroll" style={{ height: '100%', overflowY: 'auto', paddingBottom: 100, padding: '70px 24px 100px' }}>
      <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>progressus · iron</div>
      <div className="fraktur" style={{ fontSize: 54, lineHeight: 1, marginTop: 12, color: 'var(--bone)' }}>Ascent</div>
      <div style={{ margin: '14px 0 0', width: 32, height: 1, background: 'var(--bone)' }} />

      {/* bench chart */}
      <div style={{ marginTop: 36 }}>
        <div className="kaps-sm" style={{ color: 'var(--ember)' }}>pressus pectoris</div>
        <div className="script" style={{ fontSize: 14, color: 'var(--bone)', fontStyle: 'italic', marginTop: 4 }}>the supine press</div>

        {/* chart */}
        <div style={{ position: 'relative', height: 180, marginTop: 28, borderLeft: '1px solid var(--bone-faint)', borderBottom: '1px solid var(--bone-faint)' }}>
          {/* y-axis ticks */}
          {[0, 0.33, 0.66, 1].map((t, i) => (
            <div key={i} style={{ position: 'absolute', left: -28, top: `${(1 - t) * 100}%`, fontSize: 9 }} className="mono">
              <span style={{ color: 'var(--ash)' }}>{[20, 25, 28, 30][i]}</span>
            </div>
          ))}
          {/* grid lines */}
          {[0.33, 0.66].map((t, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${(1 - t) * 100}%`, height: 0, borderTop: '1px dashed rgba(232,228,218,0.08)' }} />
          ))}
          {/* points — x: 3 data points across, y: 20, 30, 30 */}
          {(() => {
            const data = [{x: 0.05, y: 0, label: '1'}, {x: 0.5, y: 1, label: '2'}, {x: 0.95, y: 1, label: '3'}];
            return (
              <>
                {data.slice(0, -1).map((p, i) => {
                  const n = data[i+1];
                  return (
                    <svg key={i} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                      <line x1={`${p.x*100}%`} y1={`${(1-p.y)*100}%`} x2={`${n.x*100}%`} y2={`${(1-n.y)*100}%`} stroke="var(--ember)" strokeWidth="1" />
                    </svg>
                  );
                })}
                {data.map((p, i) => (
                  <div key={i} style={{
                    position: 'absolute', left: `${p.x*100}%`, top: `${(1-p.y)*100}%`,
                    transform: 'translate(-50%, -50%)', width: 8, height: 8,
                    background: 'var(--ember)', border: '1px solid var(--bone)',
                  }} />
                ))}
                {data.map((p, i) => (
                  <div key={`l${i}`} className="mono" style={{
                    position: 'absolute', left: `${p.x*100}%`, bottom: -20,
                    transform: 'translateX(-50%)', fontSize: 9, color: 'var(--ash)',
                  }}>{p.label}</div>
                ))}
              </>
            );
          })()}
        </div>

        {/* stats under chart */}
        <div style={{ marginTop: 34, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--bone-faint)' }}>
          {[
            { l: 'START',    v: '20', u: 'KG' },
            { l: 'PEAK',     v: '30', u: 'KG' },
            { l: 'DELTA',    v: '+10', u: 'KG' },
            { l: 'SESSIONS', v: '3', u: '' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: 16, textAlign: 'center',
              borderRight: i % 2 === 0 ? '1px solid var(--bone-faint)' : 'none',
              borderBottom: i < 2 ? '1px solid var(--bone-faint)' : 'none',
            }}>
              <div className="kaps-sm" style={{ fontSize: 7, color: 'var(--ash)' }}>{s.l}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontSize: 28, color: 'var(--bone)', marginTop: 6 }}>{s.v}</div>
              {s.u ? <div className="mono" style={{ fontSize: 7, color: 'var(--ash)', letterSpacing: '0.2em', marginTop: 2 }}>{s.u}</div> : null}
            </div>
          ))}
        </div>
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

window.HistoryScreen = HistoryScreen;
window.ProgressScreen = ProgressScreen;
