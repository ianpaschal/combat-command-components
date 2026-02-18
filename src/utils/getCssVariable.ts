import { CSSProperties } from 'react';

export const getCssVariable = (
  name: string,
  value: CSSProperties['maxWidth'] | undefined,
): CSSProperties | undefined => {
  if (!value) {
    return undefined;
  }
  return { [name]: typeof value === 'number' ? `${value}px` : value } as CSSProperties;
};
