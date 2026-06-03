import {
  ReactNode,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useStore } from '@tanstack/react-store';

import { ThemeContextProvider } from './ThemeProvider.context';
import { SYSTEM_THEME_KEY, useResolvedTheme } from './ThemeProvider.hooks';
import {
  getThemeStyleSheet,
  THEME_STORAGE_KEY,
  themeStore,
} from './ThemeProvider.store';

export interface ThemeProviderProps {

  /** Locks the active theme; overrides user selection and any setTheme calls. */
  theme?: string;
  children: ReactNode;
}

export const ThemeProvider = ({
  theme: forcedTheme,
  children,
}: ThemeProviderProps) => {
  const [key, setKey] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) ?? SYSTEM_THEME_KEY);
  const activeKey = forcedTheme ?? key;
  const { theme, resolvedKey } = useResolvedTheme(activeKey);
  const registry = useStore(themeStore);
  const options = useMemo(() => [
    { value: SYSTEM_THEME_KEY, label: 'System' },
    ...Object.entries(registry).map(([k, { theme: { displayName } }]) => ({
      value: k,
      label: displayName,
    })),
  ], [registry]);

  useLayoutEffect(() => {
    getThemeStyleSheet();
  }, []);

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedKey);
  }, [resolvedKey]);

  const handleSetTheme = (newKey: string) => {
    if (!forcedTheme) {
      localStorage.setItem(THEME_STORAGE_KEY, newKey);
    }
    setKey(newKey);
  };

  return (
    <ThemeContextProvider value={{ key: activeKey, theme, options, setTheme: handleSetTheme }}>
      {children}
    </ThemeContextProvider>
  );
};
