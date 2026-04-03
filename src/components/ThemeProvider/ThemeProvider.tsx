import {
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { useStore } from '@tanstack/react-store';

import { ThemeContextProvider } from './ThemeProvider.context';
import {
  SYSTEM_THEME_KEY,
  useResolvedTheme,
  useThemeVars,
} from './ThemeProvider.hooks';
import { themeStore } from './ThemeProvider.store';

export interface ThemeProviderProps {
  theme?: string;
  children: ReactNode;
}

export const ThemeProvider = ({
  theme: forcedTheme,
  children,
}: ThemeProviderProps) => {
  const [key, setKey] = useState(SYSTEM_THEME_KEY);
  const activeKey = forcedTheme ?? key;
  const theme = useResolvedTheme(activeKey);
  const registry = useStore(themeStore);
  const options = useMemo(() => [
    { value: SYSTEM_THEME_KEY, label: 'System' },
    ...Object.entries(registry).map(([k, { displayName }]) => ({
      value: k,
      label: displayName,
    })),
  ], [registry]);

  useThemeVars(theme);

  return (
    <ThemeContextProvider value={{ key: activeKey, theme, options, setTheme: setKey }}>
      {children}
    </ThemeContextProvider>
  );
};
