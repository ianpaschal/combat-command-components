import { CSSAttribute } from 'goober';

import {
  Theme,
  ThemeIntent,
  ThemeSide,
  variables,
} from '../themes';

export function borders(
  theme: Theme,
  config?: {
    intent?: ThemeIntent;
    side?: ThemeSide;
  },
): CSSAttribute {
  const borderStyle: Record<ThemeSide, string> = {
    top: 'solid none none none',
    right: 'none solid none none',
    bottom: 'none none solid none',
    left: 'none none none solid',
  };
  return {
    borderWidth: `${variables.borderWidth}px`,
    borderColor: theme.border[config?.intent ?? 'default'],
    borderStyle: config?.side ? borderStyle[config.side] : 'solid',
  };
}
