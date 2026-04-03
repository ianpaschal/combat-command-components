import type { Theme } from '../ThemeProvider.types';

const base = (l: number): string => (
  `hsl(50, 15%, ${Math.max(Math.min(l, 100), 0)}%)`
);

export const forest: Theme = {
  displayName: 'Forest',
  dark: false,
  overlayStrength: 0.45,
  shadowStrength: 0.05,
  surface: {
    page: {
      bg: base(85),
    },
    card: {
      bg: base(95),
      border: base(80),
    },
  },
  text: {
    body: base(35),
    header: base(25),
    ui: base(30),
    muted: base(40),
  },
  colors: {
    accent: {
      bg: 'hsl(12.5, 100%, 55%)',
      focus: 'hsl(200, 100%, 50%)',
      text: '#FFFFFF',
    },
    neutral: {
      bg: base(20),
      focus: 'hsl(200, 100%, 50%)',
      text: base(90),
    },
    red: {
      bg: 'hsl(10, 80%, 55%)',
      focus: 'hsl(200, 100%, 50%)',
      text: '#FFFFFF',
    },
    yellow: {
      bg: 'hsl(40 , 100%, 60%)',
      focus: 'hsl(200, 100%, 50%)',
      text: '#FFFFFF',
    },
    green: {
      bg: 'hsl(75, 70%, 40%)',
      focus: 'hsl(200, 100%, 50%)',
      text: '#FFFFFF',
    },
    blue: {
      bg: 'hsl(200, 80%, 40%)',
      focus: 'hsl(200, 100%, 50%)',
      text: '#FFFFFF',
    },
  },
};
