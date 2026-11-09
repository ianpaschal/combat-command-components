import {
  describe,
  expect,
  it,
} from 'vitest';

import { getColumnCount } from './WidgetGrid.utils';

const COLUMNS = { 0: 2, 656: 4, 992: 6 };

describe('getColumnCount', () => {
  it('returns a fixed column count at any width.', () => {
    expect(getColumnCount(6, 100)).toBe(6);
  });

  it('uses the widest minimum width that fits.', () => {
    expect(getColumnCount(COLUMNS, 655)).toBe(2);
    expect(getColumnCount(COLUMNS, 656)).toBe(4);
    expect(getColumnCount(COLUMNS, 2000)).toBe(6);
  });

  it('uses the narrowest minimum width if none fit.', () => {
    expect(getColumnCount({ 400: 3, 800: 6 }, 100)).toBe(3);
  });
});
