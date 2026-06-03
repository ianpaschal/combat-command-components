import {
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStore } from '@tanstack/react-store';

import { light } from './themes/light';
import { themeContext } from './ThemeProvider.context';
import { themeStore } from './ThemeProvider.store';
import { Theme } from './ThemeProvider.types';

export const SYSTEM_THEME_KEY = '__system';

export const useResolvedTheme = (activeKey: string): { theme: Theme; resolvedKey: string } => {
  const registry = useStore(themeStore);
  const [isDark, setIsDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);

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

export const useThemeManager = () => useContext(themeContext);
