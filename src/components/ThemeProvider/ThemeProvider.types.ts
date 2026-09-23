import { ThemeColor } from '../../types';

export type ThemeMode = '__system' | 'light' | 'dark';

export type ThemeRegistryEntry = {
  theme: Theme;
  vars: Record<string, string>;
};

export type Theme = {
  key: string;
  dark: boolean;
  overlayStrength: number;
  shadowStrength: number;
  colors: Record<ThemeColor, {
    bg: string;
    text: string;
    focus: string;
  }>;
  surface: {
    page: {
      bg: string;
    };
    card: {
      bg: string;
      border: string;
    };
  };
  text: {
    header: string;
    body: string;
    ui: string;
    muted: string;
  };
};
