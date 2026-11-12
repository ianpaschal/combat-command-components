import {
  describe,
  expect,
  it,
} from 'vitest';

import { getWidgetStyle } from './Widget.utils';

describe('getWidgetStyle', () => {
  it('converts 0-indexed corners to grid lines.', () => {
    expect(getWidgetStyle({ from: [0, 1], to: [2, 3] })).toEqual({
      gridColumn: '1 / 3',
      gridRow: '2 / 4',
    });
  });

  it('covers one slot if the corners are one apart.', () => {
    expect(getWidgetStyle({ from: [3, 0], to: [4, 1] })).toEqual({
      gridColumn: '4 / 5',
      gridRow: '1 / 2',
    });
  });
});
