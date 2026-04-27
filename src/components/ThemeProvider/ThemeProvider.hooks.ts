import {
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useStore } from '@tanstack/react-store';

import { light } from './themes/light';
import { themeContext } from './ThemeProvider.context';
import { themeStore } from './ThemeProvider.store';
import { Theme } from './ThemeProvider.types';
import { buildThemeVars } from './ThemeProvider.utils';

export const SYSTEM_THEME_KEY = '__system';

export const useResolvedTheme = (activeKey: string): Theme => {
  const registry = useStore(themeStore);
  const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setIsDark(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (activeKey === SYSTEM_THEME_KEY) {
    return isDark ? (registry['dark'] ?? registry['light'] ?? light) : (registry['light'] ?? light);
  }
  return registry[activeKey] ?? registry['light'] ?? light;
};

export const useThemeManager = () => useContext(themeContext);

export const useThemeVars = (theme: Theme): void => {
  useLayoutEffect(() => {
    const vars = buildThemeVars(theme);
    for (const [key, value] of Object.entries(vars)) {
      document.body.style.setProperty(key, value);
    }
  }, [theme]);
};
