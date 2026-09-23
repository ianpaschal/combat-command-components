import { createContext } from 'react';

import { stormLight } from './themes/storm-light';
import { SelectOption } from '../Select';
import { SYSTEM_THEME_KEY } from './ThemeProvider.constants';
import { Theme, ThemeMode } from './ThemeProvider.types';

export interface ThemeContextValue {
  key: string;
  mode: ThemeMode;
  theme: Theme;
  options: SelectOption[];
  setTheme: (key: string, mode: ThemeMode) => void;
}

export const themeContext = createContext<ThemeContextValue>({
  key: 'storm',
  mode: SYSTEM_THEME_KEY,
  theme: stormLight,
  options: [],
  setTheme: () => {},
});

export const {
  Provider: ThemeContextProvider,
} = themeContext;
