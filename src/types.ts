export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
};

export type ElementElevation = 1 | 2 | 3 | 4 | 5;

export type ElementIntent = 'accent' | 'neutral' |'danger' | 'success' | 'info' | 'warning';

export type ElementOrientation = 'horizontal' | 'vertical';

export type ElementSize = 'small' | 'normal' | 'large';

export type ElementVariant = 'solid' | 'shaded' | 'ghost' | 'surface';

export type Side = 'top' | 'bottom' | 'left' | 'right';
