import { createContext } from 'react';

import { light } from './themes/light';
import { Theme } from './ThemeProvider.types';

export const themeContext = createContext<Theme>(light);

export const {
  Provider: ThemeContextProvider,
} = themeContext;
