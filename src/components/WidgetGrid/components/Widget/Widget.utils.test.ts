import {
  describe,
  expect,
  it,
} from 'vitest';

import { getWidgetStyle } from './Widget.utils';

describe('getWidgetStyle', () => {
  it('converts inclusive corners to grid lines.', () => {
    expect(getWidgetStyle({ from: [1, 2], to: [2, 3] })).toEqual({
      gridColumn: '1 / 3',
      gridRow: '2 / 4',
    });
  });

  it('covers one slot if both corners are the same.', () => {
    expect(getWidgetStyle({ from: [4, 1], to: [4, 1] })).toEqual({
      gridColumn: '4 / 5',
      gridRow: '1 / 2',
    });
  });
});
