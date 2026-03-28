import type { Theme } from '../ThemeProvider.types';

export const light: Theme = {
  key: 'light',
  displayName: 'Light',
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
  },
  intents: {
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
    danger: {
      bg: '#E54D2E', // Radix Tomato 9
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
    warning: {
      bg: '#FFC53D', // Radix Amber 9
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
    success: {
      bg: '#46A758', // Radix Grass 9
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
    info: {
      bg: '#0090FF', // Radix Blue 9
      focus: '#0090FF', // Radix Blue 9
      text: '#FFFFFF',
    },
  },
};
