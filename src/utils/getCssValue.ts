export const getCssValue = (value: string | number | undefined): string | undefined => {
  if (value == null) {
    return undefined; 
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? `${value}px` : undefined;
  }
  return value;
};
