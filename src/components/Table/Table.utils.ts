import { PositionFlag } from './Table.types';

export const getPosition = (
  [i, total]: [number, number],
): PositionFlag[] => {
  const positions: PositionFlag[] = [];
  if (i === 0) {
    positions.push('first');
  }
  if (i + 1 === total) {
    positions.push('last');
  }
  return positions;
};

// Type guard for calc-compatible CSS values
export function isValidCSSCalcValue(value: string): boolean {
  // Empty strings are invalid
  if (value.trim() === '') {
    return false;
  }
  
  // calc-compatible units only
  // Length units: px, rem, em, cm, mm, in, pt, pc, ex, ch
  // Percentage: %
  // Viewport units: vh, vw, vmin, vmax
  const cssValuePattern = /^-?\d+(\.\d+)?(px|rem|em|%|vh|vw|vmin|vmax|cm|mm|in|pt|pc|ex|ch)?$/;
  
  return cssValuePattern.test(value.trim());
}
