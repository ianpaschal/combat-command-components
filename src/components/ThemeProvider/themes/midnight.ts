import type { Theme } from '../ThemeProvider.types';

const base = (l: number): string => (
  `hsl(220, 22.5%, ${Math.max(Math.min(l, 100), 0)}%)`
);

export const midnight: Theme = {
  displayName: 'Midnight',
  dark: true,
  overlayStrength: 0.65,
  shadowStrength: 0.3,
  surface: {
    page: {
      bg: base(7.5),
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
    muted: base(30),
  },
  colors: {
    accent: {

      // bg: 'hsl(5, 100%, 70%)',
      // focus: 'hsl(5, 100%, 70%)',
      bg: 'hsl(12.5, 100%, 65%)',
      focus: 'hsl(12.5, 100%, 65%)',
      text: 'hsl(0, 0%, 100%)',
    },
    neutral: {
      bg: base(55),
      focus: base(55),
      text: base(15),
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

    // orange: {
    //   bg: 'hsl(30, 90%, 60%)',
    //   focus: 'hsl(30, 90%, 60%)',
    //   text: 'hsl(30, 90%, 15%)',
    // },
    // teal: {
    //   bg: 'hsl(175, 40%, 48%)',
    //   focus: 'hsl(175, 40%, 48%)',
    //   text: 'hsl(0, 0%, 100%)',
    // },
    // purple: {
    //   bg: 'hsl(270, 45%, 55%)',
    //   focus: 'hsl(270, 45%, 55%)',
    //   text: 'hsl(0, 0%, 100%)',
    // },
    // magenta: {
    //   bg: 'hsl(320, 60%, 58%)',
    //   focus: 'hsl(320, 60%, 58%)',
    //   text: 'hsl(0, 0%, 100%)',
    // },
  },
};
