import { CSSAttribute } from 'goober';

import {
  Theme,
  ThemeIntent,
  variables,
} from '../themes';

type TextWeight = 'default' | 'light' | 'bold';

export function textDefault(
  theme: Theme,
  config?: {
    intent?: ThemeIntent;
    weight?: TextWeight;
  },
): CSSAttribute {
  const fontWeights: Record<TextWeight, number> = {
    default: 400,
    light: 300,
    bold: 500,
  };
  return {
    ...variables.text.normal,
    color: theme.text[config?.intent ?? 'default'],
    fontFamily: '"Figtree", sans-serif',
    fontWeight: fontWeights[config?.weight ?? 'default'],
    letterSpacing: '0.25px',
  };
}
