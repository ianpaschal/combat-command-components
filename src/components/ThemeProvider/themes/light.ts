import type { Theme } from '../ThemeProvider.types';

export const light: Theme = {
  displayName: 'Light',
  dark: false,
  overlayStrength: 0.45,
  shadowStrength: 0.05,
  surface: {
    page: {
      bg: '#F9F9F9', // Radix Gray 2
    },
    card: {
      bg: '#FFFFFF',
      border: '#E8E8E8', // Radix Gray 4
    },
  },
  text: {
    body: '#646464', // Radix Gray 11
    header: '#202020', // Radix Gray 12
    ui: '#646464', // Radix Gray 11
    muted: '#CECECE', // Radix Gray 7
  },
  colors: {
    accent: {
      bg: '#202020', // Radix Gray 12
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
    neutral: {
      bg: '#202020', // Radix Gray 12
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
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
