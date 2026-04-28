import type { Theme } from '../ThemeProvider.types';
import { brandPrimary, brandSecondary } from './shared';

export const daybreak: Theme = {
  displayName: 'Daybreak',
  dark: false,
  overlayStrength: 0.45,
  shadowStrength: 0.05,
  surface: {
    page: {
      bg: brandSecondary(95),
    },
    card: {
      bg: brandSecondary(100),
      border: brandSecondary(90),
    },
  },
  text: {
    body: brandSecondary(45),
    header: brandSecondary(25),
    ui: brandSecondary(35),
    muted: brandSecondary(60),
  },
  colors: {
    accent: {
      bg: brandPrimary(),
      focus: brandPrimary(),
      text: 'hsl(0, 0%, 100%)',
    },
    neutral: {
      bg: brandSecondary(45),
      focus: brandSecondary(45),
      text: brandSecondary(100),
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
