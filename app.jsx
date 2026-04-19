// App.jsx — shell, tab bar, transitions, tweaks

function TabBar({ tab, setTab }) {
  const items = [
    { id: 'home',     label: 'ALTARE',   fraktur: 'A' },
    { id: 'history',  label: 'CHRONICON', fraktur: 'C' },
    { id: 'progress', label: 'ASCENSUS', fraktur: 'E' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30,
      background: 'linear-gradient(to top, var(--void) 60%, transparent)',
      paddingTop: 20, paddingBottom: 28,
    }}>
      <div style={{
        margin: '0 20px',
        borderTop: '1px solid var(--bone-faint)',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        {items.map((it) => {
          const active = tab === it.id;
          return (
            <div
              key={it.id}
              className="press"
              onClick={() => setTab(it.id)}
              style={{
                padding: '14px 8px 8px', textAlign: 'center',
                borderRight: it.id !== 'progress' ? '1px solid var(--bone-ghost)' : 'none',
                position: 'relative',
              }}
            >
              {active && (
                <div style={{
                  position: 'absolute', top: -1, left: '30%', right: '30%',
                  height: 1, background: 'var(--ember)',
                }} />
              )}
              <div className="kaps-sm" style={{
                color: active ? 'var(--bone)' : 'var(--ash)',
                fontSize: 8,
              }}>{it.label}</div>
              {active && (
                <div style={{ marginTop: 6, fontSize: 4 }}>
                  <span className="cross-sm" style={{ color: 'var(--ember)', display: 'inline-block' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = React.useState(() => {
    try { return localStorage.getItem('mygym_tab') || 'home'; } catch { return 'home'; }
  });
  const [screen, setScreen] = React.useState(() => {
    try { return localStorage.getItem('mygym_screen') || 'home'; } catch { return 'home'; }
  });

  React.useEffect(() => {
    try { localStorage.setItem('mygym_tab', tab); } catch {}
  }, [tab]);
  React.useEffect(() => {
    try { localStorage.setItem('mygym_screen', screen); } catch {}
  }, [screen]);

  const open = (s) => {
    if (s === 'active') {
      setScreen('active');
    } else if (s === 'history') {
      setTab('history');
      setScreen('home');
    } else if (s === 'home') {
      setScreen('home');
      setTab('home');
    }
  };

  const onTab = (t) => {
    setTab(t);
    setScreen('home');
  };

  const [key, setKey] = React.useState(0);
  React.useEffect(() => { setKey(k => k + 1); }, [tab, screen]);

  const renderContent = () => {
    if (screen === 'active') return <ActiveScreen onOpen={open} />;
    if (tab === 'history') return <HistoryScreen onOpen={open} />;
    if (tab === 'progress') return <ProgressScreen onOpen={open} />;
    return <HomeScreen onOpen={open} />;
  };

  return (
    <IOSDevice dark width={390} height={844}>
      <div className="ritual-root" style={{ height: '100%', position: 'relative' }}>
        <div className="ritual-grain" />
        <div key={key} style={{ position: 'absolute', inset: 0 }}>
          {renderContent()}
        </div>
        {screen !== 'active' && <TabBar tab={tab} setTab={onTab} />}
      </div>
    </IOSDevice>
  );
}

window.App = App;

function Mount() {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    // wait for fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setReady(true));
      setTimeout(() => setReady(true), 1500);
    } else {
      setTimeout(() => setReady(true), 400);
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 10px',
      background: '#050505',
      backgroundImage: `radial-gradient(ellipse at center, #0a0808 0%, #000 70%)`,
    }}>
      <div style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.6s' }}>
        <App />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Mount />);
