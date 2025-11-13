import { useContext } from 'react';

import { light } from '../../themes';
import { ThemeContext } from './ThemeProvider.context';

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (theme === undefined) {
    return light;
  }
  return theme;
};
