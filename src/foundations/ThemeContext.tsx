import {
  createContext, useContext, useEffect, useState, memo, useCallback, useMemo,
  type ReactNode,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useTheme = (): ThemeContextValue => useContext(ThemeContext);

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme before reading storage/system (default: 'dark') */
  defaultTheme?: Theme;
  /** localStorage key (default: 'aegis-theme') */
  storageKey?: string;
  /** Disable localStorage persistence */
  disableStorage?: boolean;
}

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark',  theme === 'dark');
  root.classList.toggle('light', theme === 'light');
};

const resolveInitialTheme = (storageKey: string, defaultTheme: Theme): Theme => {
  if (typeof window === 'undefined') return defaultTheme;
  const stored = localStorage.getItem(storageKey) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return defaultTheme;
};

export const ThemeProvider = memo(({
  children,
  defaultTheme = 'dark',
  storageKey = 'aegis-theme',
  disableStorage = false,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() =>
    resolveInitialTheme(storageKey, defaultTheme),
  );

  // Apply to DOM whenever theme changes
  useEffect(() => {
    applyTheme(theme);
    if (!disableStorage) localStorage.setItem(storageKey, theme);
  }, [theme, storageKey, disableStorage]);

  // Listen for system preference changes
  useEffect(() => {
    if (disableStorage) return;
    const stored = localStorage.getItem(storageKey);
    if (stored) return; // user has explicit preference, don't override
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? 'light' : 'dark');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [storageKey, disableStorage]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState(t => (t === 'dark' ? 'light' : 'dark')), []);
  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
});
ThemeProvider.displayName = 'ThemeProvider';

export default ThemeContext;
