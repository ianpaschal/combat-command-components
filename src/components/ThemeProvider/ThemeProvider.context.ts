import { createContext } from 'react';

import { Theme } from '../../themes';

export const ThemeContext = createContext<Theme | undefined>(undefined);
