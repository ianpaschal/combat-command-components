import type { Theme } from '../ThemeProvider.types';

export const dark: Theme = {
  key: 'dark',
  displayName: 'Dark',
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
  },
  text: {
    body: '#B4B4B4', // Radix Gray 11 Dark
    header: '#EEEEEE', // Radix Gray 12 Dark
    ui: '#B4B4B4', // Radix Gray 11 Dark
  },
  intents: {
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
    danger: {
      bg: '#E54D2E', // Radix Tomato 9 Dark
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
    warning: {
      bg: '#FFC53D', // Radix Amber 9 Dark
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
    success: {
      bg: '#46A758', // Radix Grass 9 Dark
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
    info: {
      bg: '#0090FF', // Radix Blue 9 Dark
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
  },
};
