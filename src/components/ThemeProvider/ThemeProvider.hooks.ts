import { useContext, useLayoutEffect } from 'react';

import { themeContext } from './ThemeProvider.context';
import { Theme } from './ThemeProvider.types';
import { buildThemeVars } from './ThemeProvider.utils';

export const useTheme = (): Theme => useContext(themeContext);

export const useThemeVars = (theme: Theme): void => {
  useLayoutEffect(() => {
    const vars = buildThemeVars(theme);
    const root = document.documentElement;
    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }
  }, [theme]);
};
