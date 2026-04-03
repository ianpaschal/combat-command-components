export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
};

export type ElementElevation = 1 | 2 | 3 | 4 | 5;

export const ELEMENT_INTENTS = [
  'primary',
  'secondary',
  'danger',
  'warning',
  'success',
  'info',
] as const;

export type ElementIntent = (typeof ELEMENT_INTENTS)[number];

export type ElementOrientation = 'horizontal' | 'vertical';

export type ElementSize = 'small' | 'normal' | 'large';

export type ElementVariant = 'solid' | 'shaded' | 'ghost' | 'surface';

export type Side = 'top' | 'bottom' | 'left' | 'right';

export const THEME_COLORS = [
  'accent',
  'neutral',
  'red',
  'yellow',
  'green',
  'blue',

  // 'orange',
  // 'teal',
  // 'purple',
  // 'magenta',
] as const;

export type ThemeColor = (typeof THEME_COLORS)[number];
