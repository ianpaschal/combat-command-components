import {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useStore } from '@tanstack/react-store';

import { SYSTEM_THEME_KEY } from './ThemeProvider.constants';
import { themeContext } from './ThemeProvider.context';
import { themeStore } from './ThemeProvider.store';
import { Theme, ThemeMode } from './ThemeProvider.types';

export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Resolves a theme key and mode to a `Theme` object and a concrete `dark`
 * flag. Handles `SYSTEM_THEME_KEY` by mapping it to `prefers-color-scheme`,
 * and subscribes to OS preference changes.
 *
 * @param key - The active theme key.
 * @param mode - The active mode, which may be `SYSTEM_THEME_KEY`.
 * @returns The resolved `Theme` object and its `dark` flag (matching
 *   `Theme.dark`, never the `SYSTEM_THEME_KEY` sentinel).
 */
export const useResolvedTheme = (key: string, mode: ThemeMode): { theme: Theme; dark: boolean } => {
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

  const dark = mode === SYSTEM_THEME_KEY ? isDark : mode === 'dark';
  const family = registry[key] ?? registry['storm'];
  const theme = (dark ? family.dark : family.light).theme;
  return { theme, dark };
};

/**
 * Returns the theme context value from the nearest `ThemeProvider`, exposing
 * the active key, resolved `Theme` object, available options, and `setTheme`.
 */
export const useThemeManager = () => useContext(themeContext);

/**
 * Returns the current resolved `Theme` object from the nearest `ThemeProvider`.
 */
export const useTheme = (): Theme => useContext(themeContext).theme;
