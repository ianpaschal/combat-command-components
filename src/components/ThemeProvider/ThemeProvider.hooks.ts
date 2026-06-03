import {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useStore } from '@tanstack/react-store';

import { light } from './themes/light';
import { SYSTEM_THEME_KEY } from './ThemeProvider.constants';
import { themeContext } from './ThemeProvider.context';
import { themeStore } from './ThemeProvider.store';
import { Theme } from './ThemeProvider.types';

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Resolves an active theme key to a `Theme` object and a concrete registry key.
 * Handles `SYSTEM_THEME_KEY` by mapping it to `"dark"` or `"light"` based on
 * `prefers-color-scheme`, and subscribes to OS preference changes.
 *
 * @param activeKey - The active theme key, which may be `SYSTEM_THEME_KEY`.
 * @returns The resolved `Theme` object and the concrete key (never
 *   `SYSTEM_THEME_KEY`).
 */
export const useResolvedTheme = (activeKey: string): { theme: Theme; resolvedKey: string } => {
  const registry = useStore(themeStore);
  const [isDark, setIsDark] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  ));

  useIsomorphicLayoutEffect(() => {
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setIsDark(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (activeKey === SYSTEM_THEME_KEY) {
    const resolvedKey = isDark ? 'dark' : 'light';
    return {
      theme: registry[resolvedKey]?.theme ?? registry['light']?.theme ?? light,
      resolvedKey,
    };
  }
  return {
    theme: registry[activeKey]?.theme ?? registry['light']?.theme ?? light,
    resolvedKey: activeKey,
  };
};

/**
 * Returns the theme context value from the nearest `ThemeProvider`, exposing
 * the active key, resolved `Theme` object, available options, and `setTheme`.
 */
export const useThemeManager = () => useContext(themeContext);
