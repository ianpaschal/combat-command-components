import {
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { useStore } from '@tanstack/react-store';

import {
  decodeLegacyThemeValue,
  SYSTEM_THEME_KEY,
  THEME_MODE_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from './ThemeProvider.constants';
import { ThemeContextProvider } from './ThemeProvider.context';
import { useIsomorphicLayoutEffect, useResolvedTheme } from './ThemeProvider.hooks';
import { getThemeStyleSheet, themeStore } from './ThemeProvider.store';
import { ThemeMode } from './ThemeProvider.types';

export interface ThemeProviderProps {

  /** Locks the active key; overrides user selection and any setTheme calls. */
  themeKey?: string;

  /** Locks the active mode; overrides user selection and any setTheme calls. */
  themeMode?: ThemeMode;
  children: ReactNode;
}

/**
 * Reads the persisted key/mode from their two `localStorage` slots. If only a
 * single legacy value exists (from before `key` and `mode` were stored
 * separately), decodes it into the two instead.
 */
const readStoredThemeState = (): { key: string; mode: ThemeMode } => {
  if (typeof window === 'undefined') {
    return { key: 'storm', mode: SYSTEM_THEME_KEY };
  }
  const storedKey = localStorage.getItem(THEME_STORAGE_KEY);
  const storedMode = localStorage.getItem(THEME_MODE_STORAGE_KEY) as ThemeMode | null;
  if (storedKey && storedMode) {
    return { key: storedKey, mode: storedMode };
  }
  return decodeLegacyThemeValue(storedKey);
};

export const ThemeProvider = ({
  themeKey: forcedKey,
  themeMode: forcedMode,
  children,
}: ThemeProviderProps) => {
  const [initialState] = useState(readStoredThemeState);
  const [key, setKey] = useState(initialState.key);
  const [mode, setMode] = useState<ThemeMode>(initialState.mode);

  const activeKey = forcedKey ?? key;
  const activeMode = forcedMode ?? mode;
  const { theme, dark } = useResolvedTheme(activeKey, activeMode);
  const registry = useStore(themeStore);
  const options = useMemo(() => (
    Object.entries(registry).map(([registeredKey, { displayName }]) => ({
      value: registeredKey,
      label: displayName,
    }))
  ), [registry]);

  useIsomorphicLayoutEffect(() => {
    getThemeStyleSheet();
  }, [registry]);

  useIsomorphicLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme-key', activeKey);
    document.documentElement.setAttribute('data-theme-mode', dark ? 'dark' : 'light');
  }, [activeKey, dark]);

  const setTheme = (newKey: string, newMode: ThemeMode) => {
    if (!forcedKey && !forcedMode) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newKey);
        localStorage.setItem(THEME_MODE_STORAGE_KEY, newMode);
      } catch (e) {
        console.error(e);
      }
      setKey(newKey);
      setMode(newMode);
    }
  };

  return (
    <ThemeContextProvider value={{ key: activeKey, mode: activeMode, theme, options, setTheme }}>
      {children}
    </ThemeContextProvider>
  );
};
