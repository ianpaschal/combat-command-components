import type { Theme } from '../ThemeProvider.types';

export const dark: Theme = {
  displayName: 'Dark',
  dark: true,
  overlayStrength: 0.65,
  shadowStrength: 0.3,
  surface: {
    page: {
      bg: '#111111', // Radix Gray 1 Dark
    },
    card: {
      bg: '#191919', // Radix Gray 2 Dark
      border: '#222222', // Radix Gray 3 Dark
    },

    // highlight: {
    //   bg: '#191919', // Radix Gray 2 Dark
    //   border: '#222222', // Radix Gray 3 Dark
    // },
  },
  text: {
    body: '#B4B4B4', // Radix Gray 11 Dark
    header: '#EEEEEE', // Radix Gray 12 Dark
    ui: '#B4B4B4', // Radix Gray 11 Dark
    muted: '#484848', // Radix Gray 7 Dark
  },
  colors: {
    accent: {
      bg: '#EEEEEE', // Radix Gray 12 Dark
      focus: '#0090FF', // Radix Blue 9
      text: '#111111', // Radix Gray 1 Dark
    },
    neutral: {
      bg: '#EEEEEE', // Radix Gray 12 Dark
      focus: '#0090FF', // Radix Blue 9
      text: '#111111', // Radix Gray 1 Dark
    },
    red: {
      bg: '#E54D2E', // Radix Tomato 9
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
    yellow: {
      bg: '#FFC53D', // Radix Amber 9
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
    green: {
      bg: '#46A758', // Radix Grass 9
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
    blue: {
      bg: '#0090FF', // Radix Blue 9
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },

    // orange: {
    //   bg: '#F76B15', // Radix Orange 9
    //   focus: '#0090FF', // Radix Blue 9
    //   text: '#FFFFFF',
    // },
    // teal: {
    //   bg: '#12A594', // Radix Teal 9
    //   focus: '#0090FF', // Radix Blue 9
    //   text: '#FFFFFF',
    // },
    // purple: {
    //   bg: '#8E4EC6', // Radix Purple 9
    //   focus: '#0090FF', // Radix Blue 9
    //   text: '#FFFFFF',
    // },
    // magenta: {
    //   bg: '#E93D82', // Radix Crimson 9
    //   focus: '#0090FF', // Radix Blue 9
    //   text: '#FFFFFF',
    // },
  },
};
