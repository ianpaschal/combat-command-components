import { CSSAttribute } from 'goober';

type CornerRadius = 'tight' | 'default' | 'wide' | 'full';

export function corners(config?: {
  radius?: CornerRadius;
}): CSSAttribute {
  const borderRadius: Record<CornerRadius, string> = {
    tight: '0.25rem',
    default: '0.375rem',
    wide: '0.5rem',
    full: '100%',
  };
  return {
    borderRadius: borderRadius[config?.radius ?? 'default'],
  };
}
