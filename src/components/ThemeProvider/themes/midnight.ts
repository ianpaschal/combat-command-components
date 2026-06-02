import type { Theme } from '../ThemeProvider.types';
import { brandPrimary, brandSecondary } from './shared';

export const midnight: Theme = {
  displayName: 'Midnight',
  dark: true,
  overlayStrength: 0.65,
  shadowStrength: 0.3,
  surface: {
    page: {
      bg: brandSecondary(5),
    },
    card: {
      bg: brandSecondary(10),
      border: brandSecondary(15),
    },
  },
  text: {
    body: brandSecondary(70),
    header: brandSecondary(80),
    ui: brandSecondary(55),
    muted: brandSecondary(30),
  },
  colors: {
    accent: {
      bg: brandPrimary(),
      focus: brandPrimary(),
      text: 'hsl(0, 0%, 100%)',
    },
    neutral: {
      bg: brandSecondary(55),
      focus: brandSecondary(55),
      text: brandSecondary(10),
    },
    red: {
      bg: 'hsl(5, 90%, 60%)',
      focus: 'hsl(5, 90%, 60%)',
      text: 'hsl(0, 0%, 100%)',
    },
    yellow: {
      bg: 'hsl(40, 100%, 70%)',
      focus: 'hsl(40, 100%, 70%)',
      text: 'hsl(40, 100%, 15%)',
    },
    green: {
      bg: 'hsl(130, 35%, 50%)',
      focus: 'hsl(130, 35%, 50%)',
      text: 'hsl(0, 0%, 100%)',
    },
    blue: {
      bg: 'hsl(220, 65%, 60%)',
      focus: 'hsl(220, 65%, 60%)',
      text: 'hsl(0, 0%, 100%)',
    },
  },
};
