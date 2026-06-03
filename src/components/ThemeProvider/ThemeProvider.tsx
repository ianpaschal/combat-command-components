import {
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { useStore } from '@tanstack/react-store';

import { SYSTEM_THEME_KEY, THEME_STORAGE_KEY } from './ThemeProvider.constants';
import { ThemeContextProvider } from './ThemeProvider.context';
import { useIsomorphicLayoutEffect, useResolvedTheme } from './ThemeProvider.hooks';
import { getThemeStyleSheet, themeStore } from './ThemeProvider.store';

export interface ThemeProviderProps {

  /** Locks the active theme; overrides user selection and any setTheme calls. */
  theme?: string;
  children: ReactNode;
}

export const ThemeProvider = ({
  theme: forcedTheme,
  children,
}: ThemeProviderProps) => {
  const [key, setKey] = useState(() => (
    typeof window !== 'undefined' ? (localStorage.getItem(THEME_STORAGE_KEY) ?? SYSTEM_THEME_KEY) : SYSTEM_THEME_KEY
  ));
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

  useIsomorphicLayoutEffect(() => {
    getThemeStyleSheet();
  }, [registry]);

  useIsomorphicLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedKey);
  }, [resolvedKey]);

  const handleSetTheme = (newKey: string) => {
    if (!forcedTheme) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newKey);
      } catch (e) {
        console.error(e);
      }
      setKey(newKey);
    }
  };

  return (
    <ThemeContextProvider value={{ key: activeKey, theme, options, setTheme: handleSetTheme }}>
      {children}
    </ThemeContextProvider>
  );
};
