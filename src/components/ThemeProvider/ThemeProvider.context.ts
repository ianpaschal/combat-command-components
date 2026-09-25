import { createContext } from 'react';

import { light } from './themes/light';
import { SelectOption } from '../Select';
import { Theme } from './ThemeProvider.types';

/* `dark` is left undefined for the system option, which has no inherent light/
 * dark polarity of its own - only for options backed by a registered theme, so
 * consumers can filter/group options by polarity (e.g. separate light-theme and
 * dark-theme pickers).
 */
export type ThemeOption = SelectOption & { dark?: boolean };

export interface ThemeContextValue {
  key: string;
  theme: Theme;
  options: ThemeOption[];
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
