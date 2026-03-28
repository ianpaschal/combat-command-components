import type { Theme } from '../ThemeProvider.types';

const base = (l: number): string => (
  `hsl(220, 22.5%, ${Math.max(Math.min(l, 100), 0)}%)`
);

export const midnight: Theme = {
  key: 'midnight',
  displayName: 'Midnight',
  overlayStrength: 0.65,
  shadowStrength: 0.3,
  surface: {
    page: {
      bg: base(5),
    },
    card: {
      bg: base(10),
      border: base(15),
    },
  },
  text: {
    body: base(70),
    header: base(80),
    ui: base(55),
  },
  intents: {
    accent: {
      bg: 'hsl(5, 100%, 70%)',
      focus: 'hsl(5, 100%, 70%)',
      text: base(15),
    },
    neutral: {
      bg: base(55),
      focus: base(55),
      text: base(15),
    },
    danger: {
      bg: 'hsl(15, 90%, 60%)',
      focus: 'hsl(15, 90%, 60%)',
      text: 'hsl(0, 0%, 100%)',
    },
    warning: {
      bg: 'hsl(40, 100%, 70%)',
      focus: 'hsl(40, 100%, 70%)',
      text: 'hsl(40, 100%, 15%)',
    },
    success: {
      bg: 'hsl(130, 35%, 50%)',
      focus: 'hsl(130, 35%, 50%)',
      text: 'hsl(0, 0%, 100%)',
    },
    info: {
      bg: 'hsl(220, 65%, 60%)',
      focus: 'hsl(220, 65%, 60%)',
      text: 'hsl(0, 0%, 100%)',
    },
  },
};
