// Home.jsx — the altar. Ritual home screen.

function HomeScreen({ onOpen }) {
  // Pulled from the fallback seed data of the source repo
  const history = [
    { n: 1, date: '01 APR 2026', label: 'training the first',  total: 2340, ember: 0.2 },
    { n: 2, date: '07 APR 2026', label: 'training the second', total: 2880, ember: 0.5 },
    { n: 3, date: '11 APR 2026', label: 'training the third',  total: 3250, ember: 0.85 },
  ];
  const last = history[history.length - 1];
  const nextNum = history.length + 1;
  const daysSince = 9;  // April 20 - April 11

  // Heatmap: chest(bench), back(lat/row), shoulders(press), arms(biceps), legs(press/ext), core(raise)
  const intensity = {
    chest: 0.92,
    back: 0.55,
    shoulders: 0.48,
    arms: 0.70,
    legs: 0.62,
    core: 0.40,
  };

  // PRs — "carved sigils"
  const prs = [
    { name: 'BENCH',     value: '30', unit: 'КГ', sets: 'ПР · 3' },
    { name: 'LAT·PULL',  value: '6',  unit: 'ПЛ', sets: 'ПР · 2' },
    { name: 'BICEPS',    value: '15', unit: 'КГ', sets: 'ПР · 3' },
    { name: 'LEG·EXT',   value: '15', unit: 'КГ', sets: 'ПР · 3' },
  ];

  // Liturgical calendar (month)
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = i + 1;
    const worked = [1, 7, 11].includes(d);
    const today = d === 20;
    return { d, worked, today };
  });

  // Roman numeral
  const roman = (n) => {
    const map = [[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let r = '', x = n;
    for (const [v, s] of map) { while (x >= v) { r += s; x -= v; } }
    return r;
  };

  return (
    <div className="ritual-scroll" style={{
      height: '100%',
      overflowY: 'auto',
      background: 'var(--void)',
      paddingBottom: 90,
    }}>
      {/* ═══════════════ I. THE VOID ABOVE ═══════════════ */}
      <div style={{ height: 110, position: 'relative' }}>
        {/* hairline — horizon */}
        <div style={{ position: 'absolute', top: 70, left: 24, right: 24, height: 1, background: 'rgba(232,228,218,0.15)' }} />
        {/* tiny cipher — top left */}
        <div className="mono rise" style={{ position: 'absolute', top: 78, left: 24, fontSize: 9, color: 'var(--bone-dim)' }}>
          20 · APR · 2026
        </div>
        {/* session sigil — top right */}
        <div className="rise" style={{ position: 'absolute', top: 78, right: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="cross-sm" style={{ color: 'var(--ember)' }} />
          <span className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)' }}>SESSION · {nextNum}</span>
        </div>
      </div>

      {/* ═══════════════ II. THE TITLE — FRAKTUR ═══════════════ */}
      <div className="rise rise-2" style={{ padding: '0 24px', textAlign: 'center', marginTop: 8 }}>
        <div className="fraktur" style={{
          fontSize: 72,
          lineHeight: 0.88,
          color: 'var(--bone)',
          letterSpacing: '0.02em',
        }}>
          Mÿ Gÿm
        </div>
        <div style={{ margin: '18px auto 0', width: 48, height: 1, background: 'var(--bone)' }} />
        <div className="kaps-sm rise rise-3" style={{ marginTop: 14, color: 'var(--bone-dim)' }}>
          a liturgy of iron · full body
        </div>
      </div>

      {/* ═══════════════ III. SINCE THE LAST OFFERING ═══════════════ */}
      <div className="rise rise-3" style={{ padding: '48px 24px 0', textAlign: 'center' }}>
        <div className="kaps-sm" style={{ color: 'var(--ash)' }}>days since last rite</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontSize: 108, lineHeight: 0.9, marginTop: 10, color: 'var(--ember)', fontFeatureSettings: '"onum"' }}>
          {daysSince}
        </div>
        <div className="script" style={{ fontSize: 13, color: 'var(--bone-dim)', marginTop: 12, fontStyle: 'italic' }}>
          ― nine days in exile from the altar
        </div>
      </div>

      {/* ═══════════════ IV. THE SACRAMENT BUTTON ═══════════════ */}
      <div className="rise rise-4" style={{ padding: '40px 24px 0' }}>
        <div
          className="press"
          onClick={() => onOpen('active')}
          style={{
            position: 'relative',
            padding: '32px 20px',
            border: '1px solid var(--bone)',
            background: 'var(--void)',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          {/* corner marks */}
          <div style={{ position: 'absolute', top: 6, left: 6, width: 10, height: 10, borderLeft: '1px solid var(--bone)', borderTop: '1px solid var(--bone)' }} />
          <div style={{ position: 'absolute', top: 6, right: 6, width: 10, height: 10, borderRight: '1px solid var(--bone)', borderTop: '1px solid var(--bone)' }} />
          <div style={{ position: 'absolute', bottom: 6, left: 6, width: 10, height: 10, borderLeft: '1px solid var(--bone)', borderBottom: '1px solid var(--bone)' }} />
          <div style={{ position: 'absolute', bottom: 6, right: 6, width: 10, height: 10, borderRight: '1px solid var(--bone)', borderBottom: '1px solid var(--bone)' }} />

          <div className="kaps-sm" style={{ color: 'var(--ash)' }}>enter the rite</div>
          <div className="fraktur" style={{ fontSize: 44, lineHeight: 0.9, marginTop: 14, color: 'var(--bone)' }}>
            Begin
          </div>
          <div className="script ember-pulse" style={{ fontSize: 13, color: 'var(--ember-dim)', marginTop: 10, fontStyle: 'italic' }}>
            — lift, that the iron may know thee
          </div>
        </div>
        {/* bodyweight — whisper option */}
        <div
          className="press"
          onClick={() => onOpen('active')}
          style={{
            marginTop: 10,
            textAlign: 'center',
            padding: '14px',
            border: '1px solid var(--bone-faint)',
            color: 'var(--bone-dim)',
          }}
        >
          <span className="kaps-sm">or · without the altar · bodyweight</span>
        </div>
      </div>

      {/* ═══════════════ V. THE BODY — ANATOMICAL ENGRAVING ═══════════════ */}
      <div className="rise rise-4" style={{ padding: '64px 0 0', position: 'relative' }}>
        <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>figura · anatomica</div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ash)' }}>7 · DAYS</div>
        </div>
        <div className="rule-dim" style={{ margin: '0 24px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, padding: '20px 16px 0', alignItems: 'start' }}>
          {/* left legend */}
          <div style={{ paddingTop: 18, textAlign: 'right' }}>
            <LegendRow name="PECTUS"      ru="грудь"      v={intensity.chest} />
            <LegendRow name="DORSUM"      ru="спина"      v={intensity.back} />
            <LegendRow name="HUMERI"      ru="плечи"      v={intensity.shoulders} />
          </div>

          {/* figure */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <RitualFigure intensity={intensity} size={150} />
          </div>

          {/* right legend */}
          <div style={{ paddingTop: 18 }}>
            <LegendRow name="BRACHIUM"  ru="руки"   v={intensity.arms} align="left" />
            <LegendRow name="ABDOMEN"   ru="пресс"  v={intensity.core} align="left" />
            <LegendRow name="CRUS"      ru="ноги"   v={intensity.legs} align="left" />
          </div>
        </div>

        {/* script under figure */}
        <div className="script" style={{ textAlign: 'center', padding: '12px 40px 0', fontSize: 12, color: 'var(--bone-dim)', fontStyle: 'italic', lineHeight: 1.4 }}>
          that which bleedeth, groweth.<br/>
          <span style={{ color: 'var(--ash)', fontSize: 10 }}>― sum of offerings, seven days</span>
        </div>
      </div>

      {/* ═══════════════ VI. LITURGICAL CALENDAR ═══════════════ */}
      <div className="rise rise-5" style={{ padding: '56px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>kalendarium · aprilis</div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ash)' }}>3 / 30</div>
        </div>
        <div className="rule-dim" />

        {/* week-day ribbon */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, padding: '14px 0 6px' }}>
          {['L','M','M','J','V','S','D'].map((d, i) => (
            <div key={i} className="mono" style={{ fontSize: 8, color: 'var(--ash)', textAlign: 'center' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {/* 2 empty cells for Apr 1 = Wednesday offset (not accurate to calendar, ritual approximation) */}
          {[...Array(2)].map((_, i) => <div key={`e${i}`} style={{ aspectRatio: 1 }} />)}
          {days.map((d) => (
            <div key={d.d} style={{
              aspectRatio: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: d.today ? '1px solid var(--ember)' : 'none',
            }}>
              {d.worked ? (
                <div style={{
                  position: 'absolute',
                  inset: '22%',
                  background: 'var(--ember)',
                  opacity: 0.9,
                }} />
              ) : null}
              <div className="mono" style={{
                fontSize: 9,
                position: 'relative',
                zIndex: 1,
                color: d.worked ? 'var(--bone)' : d.today ? 'var(--ember)' : 'var(--bone-ghost)',
                fontWeight: d.today ? 500 : 300,
              }}>{d.d}</div>
            </div>
          ))}
        </div>
        <div className="script" style={{ textAlign: 'center', padding: '16px 40px 0', fontSize: 11, color: 'var(--ash)', fontStyle: 'italic' }}>
          three offerings · twenty-seven abstentions
        </div>
      </div>

      {/* ═══════════════ VII. PERSONAL RECORDS — SIGIL TABLETS ═══════════════ */}
      <div className="rise rise-5" style={{ padding: '56px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>sigilla · records</div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ash)' }}>4 · RECORDS</div>
        </div>
        <div className="rule-dim" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
          {prs.map((pr, i) => <Tablet key={pr.name} pr={pr} />)}
        </div>
      </div>

      {/* ═══════════════ VIII. HISTORY — PROCESSION ═══════════════ */}
      <div className="rise rise-6" style={{ padding: '56px 0 0' }}>
        <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <div className="kaps-sm" style={{ color: 'var(--bone-dim)' }}>chronicon</div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--ash)' }}>3 · ENTRIES</div>
        </div>
        <div className="rule-dim" style={{ margin: '0 24px' }} />

        <div style={{ padding: '8px 0' }}>
          {[...history].reverse().map((h, i) => (
            <div
              key={h.n}
              className="press"
              onClick={() => onOpen('history')}
              style={{
                padding: '18px 24px',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto auto',
                gap: 14,
                alignItems: 'center',
                borderBottom: i < history.length - 1 ? '1px solid var(--bone-ghost)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontSize: 24, color: 'var(--bone)', width: 28 }}>
                {String(h.n).padStart(2, '0')}
              </div>
              <div>
                <div className="script" style={{ fontSize: 14, color: 'var(--bone)', fontStyle: 'italic' }}>{h.label}</div>
                <div className="mono" style={{ fontSize: 9, color: 'var(--ash)', marginTop: 2, letterSpacing: '0.15em' }}>{h.date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ fontSize: 13, color: 'var(--bone)' }}>{h.total}</div>
                <div className="mono" style={{ fontSize: 7.5, color: 'var(--ash)', marginTop: 2, letterSpacing: '0.2em' }}>KG·LIFTED</div>
              </div>
              <div style={{ width: 3, height: 38, background: 'var(--ember)', opacity: h.ember }} />
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ IX. LITANY / FOOTER ═══════════════ */}
      <div className="rise rise-6" style={{ padding: '72px 24px 40px', textAlign: 'center' }}>
        <div className="cross-sm" style={{ color: 'var(--bone-dim)', display: 'inline-block' }} />
        <div className="script" style={{ fontSize: 12, color: 'var(--ash)', marginTop: 16, lineHeight: 1.7, fontStyle: 'italic' }}>
          the iron doth not forget.<br/>
          the iron doth not forgive.<br/>
          the iron remembereth all.
        </div>
        <div className="mono" style={{ fontSize: 8, color: 'var(--bone-ghost)', marginTop: 22, letterSpacing: '0.3em' }}>
          MYGYM · MMXXVI
        </div>
      </div>
    </div>
  );
}

// ──────────── muscle legend row ────────────
function LegendRow({ name, ru, v, align = 'right' }) {
  const opacity = 0.25 + v * 0.75;
  return (
    <div style={{
      marginBottom: 14,
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'right' ? 'flex-end' : 'flex-start',
    }}>
      <div className="kaps-sm" style={{ color: 'var(--bone)', opacity, fontSize: 9 }}>{name}</div>
      <div style={{
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexDirection: align === 'right' ? 'row' : 'row-reverse',
      }}>
        <div className="script" style={{ fontSize: 10, color: 'var(--ash)', fontStyle: 'italic' }}>{ru}</div>
        <div style={{
          width: 18,
          height: 4,
          background: v > 0 ? `rgba(139,30,30,${0.2 + v * 0.8})` : 'rgba(232,228,218,0.08)',
        }} />
      </div>
    </div>
  );
}

// ──────────── PR tablet ────────────
function Tablet({ pr }) {
  return (
    <div style={{
      position: 'relative',
      padding: '16px 14px',
      border: '1px solid var(--bone-faint)',
      textAlign: 'center',
    }}>
      {/* corner nails */}
      <div style={{ position: 'absolute', top: 3, left: 3, width: 2, height: 2, background: 'var(--bone)' }} />
      <div style={{ position: 'absolute', top: 3, right: 3, width: 2, height: 2, background: 'var(--bone)' }} />
      <div style={{ position: 'absolute', bottom: 3, left: 3, width: 2, height: 2, background: 'var(--bone)' }} />
      <div style={{ position: 'absolute', bottom: 3, right: 3, width: 2, height: 2, background: 'var(--bone)' }} />

      <div className="kaps-sm" style={{ color: 'var(--ash)', fontSize: 8 }}>{pr.name}</div>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontSize: 44, lineHeight: 1, margin: '10px 0 4px', color: 'var(--bone)' }}>
        {pr.value}
      </div>
      <div className="mono" style={{ fontSize: 8, color: 'var(--bone-dim)', letterSpacing: '0.25em' }}>{pr.unit}</div>
      <div style={{ marginTop: 8, height: 1, background: 'var(--bone-ghost)' }} />
      <div className="mono" style={{ fontSize: 8, color: 'var(--ember-dim)', marginTop: 8, letterSpacing: '0.2em' }}>
        {pr.sets}
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
