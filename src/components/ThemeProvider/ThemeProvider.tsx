import { ReactNode } from 'react';

import { Theme } from '../../themes';
import { ThemeContext } from './ThemeProvider.context';

export interface ThemeProviderProps {
  children: ReactNode;
  theme?: Theme;
}

export const ThemeProvider = ({
  children,
  theme,
}: ThemeProviderProps) => (
  <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>
);
