'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type DesignTheme = 'default' | 'ritual';

interface ThemeContextValue {
  theme: DesignTheme;
  setTheme: (next: DesignTheme) => void;
  toggle: () => void;
}

const STORAGE_KEY = 'mygym_design_theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): DesignTheme {
  if (typeof window === 'undefined') return 'default';
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === 'ritual' ? 'ritual' : 'default';
  } catch {
    return 'default';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DesignTheme>('default');

  useEffect(() => {
    setThemeState(readStoredTheme());
  }, []);

  const setTheme = useCallback((next: DesignTheme) => {
    setThemeState(next);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === 'ritual' ? 'default' : 'ritual');
  }, [theme, setTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
