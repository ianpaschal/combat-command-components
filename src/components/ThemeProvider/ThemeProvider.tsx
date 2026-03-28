import { ReactNode, useMemo } from 'react';
import deepmerge from 'deepmerge';

import { light } from './themes/light';
import { ThemeContextProvider } from './ThemeProvider.context';
import { useThemeVars } from './ThemeProvider.hooks';
import { Theme } from './ThemeProvider.types';

export interface ThemeProviderProps {
  theme?: Partial<Theme>;
  children: ReactNode;
}

export function ThemeProvider({
  theme = {},
  children,
}: ThemeProviderProps) {
  const merged = useMemo(() => deepmerge(light, theme), [theme]);
  useThemeVars(merged);
  return (
    <ThemeContextProvider value={merged}>
      {children}
    </ThemeContextProvider>
  );
}
