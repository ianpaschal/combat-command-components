import { ThemeColor } from '../../types';

export type ThemeRegistryEntry = {
  theme: Theme;
  vars: Record<string, string>;
};

export type Theme = {
  displayName: string;
  dark: boolean;
  overlayStrength: number;
  shadowStrength: number;
  glassOpacity: number;
  glassBlur: number;
  colors: Record<ThemeColor, {
    bg: string;
    text: string;
    focus: string;
  }>;
  surface: {
    glass: {
      bg: string;
    };
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
