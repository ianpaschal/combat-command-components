import { createContext } from 'react';

import { light } from './themes/light';
import { SelectOption } from '../Select';
import { Theme } from './ThemeProvider.types';

export interface ThemeContextValue {
  key: string;
  theme: Theme;
  options: SelectOption[];
  setTheme: (key: string) => void;
}

export const themeContext = createContext<ThemeContextValue>({
  key: 'light',
  theme: light,
  options: [],
  setTheme: () => {},
});

export const {
  Provider: ThemeContextProvider,
} = themeContext;
