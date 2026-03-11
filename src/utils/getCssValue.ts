export const getCssValue = (value: string | number | undefined): string | undefined => {
  if (value == null) {
    return undefined; 
  }
  return typeof value === 'number' ? `${value}px` : value;
};
