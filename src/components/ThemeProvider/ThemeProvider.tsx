import {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useStore } from '@tanstack/react-store';

import { SYSTEM_THEME_KEY, THEME_STORAGE_KEY } from './ThemeProvider.constants';
import { ThemeContextProvider } from './ThemeProvider.context';
import { useResolvedTheme } from './ThemeProvider.hooks';
import { getThemeStyleSheet, themeStore } from './ThemeProvider.store';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
      localStorage.setItem(THEME_STORAGE_KEY, newKey);
      setKey(newKey);
    }
  };

  return (
    <ThemeContextProvider value={{ key: activeKey, theme, options, setTheme: handleSetTheme }}>
      {children}
    </ThemeContextProvider>
  );
};
