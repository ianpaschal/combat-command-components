import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  ChartLinePoint,
  getAreaPath,
  getBandPath,
  getLinearPath,
  getSmoothPath,
} from './ChartLine.utils';

const POINTS: ChartLinePoint[] = [[0, 100], [50, 20], [100, 60], [150, 60]];

/**
 * Gets every number in a path, in order.
 */
const getNumbers = (path: string): number[] => (path.match(/-?\d+(\.\d+)?(e-?\d+)?/g) ?? []).map(Number);

describe('getLinearPath', () => {
  it('draws straight segments through every point.', () => {
    expect(getLinearPath(POINTS)).toBe('M0,100L50,20L100,60L150,60');
  });

  it('returns an empty path without points.', () => {
    expect(getLinearPath([])).toBe('');
  });
});

describe('getSmoothPath', () => {
  it('falls back to straight segments for fewer than 3 points.', () => {
    expect(getSmoothPath([[0, 0], [10, 10]])).toBe('M0,0L10,10');
  });

  it('starts at the first point and ends at the last.', () => {
    const path = getSmoothPath(POINTS);
    expect(path.startsWith('M0,100')).toBe(true);
    expect(path.endsWith('150,60')).toBe(true);
  });

  it('draws one curve per segment.', () => {
    expect(getSmoothPath(POINTS).match(/C/g)).toHaveLength(POINTS.length - 1);
  });

  it('never overshoots the points.', () => {
    const ys = getNumbers(getSmoothPath(POINTS)).filter((_, i) => i % 2 === 1);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(20);
    expect(Math.max(...ys)).toBeLessThanOrEqual(100);
  });

  it('handles points which share an x position.', () => {
    expect(getNumbers(getSmoothPath([[0, 0], [0, 10], [10, 20]])).every(Number.isFinite)).toBe(true);
  });

  it('stays flat between equal neighbouring points.', () => {
    const path = getSmoothPath([[0, 50], [50, 50], [100, 50]]);
    expect(getNumbers(path).filter((_, i) => i % 2 === 1).every((y) => y === 50)).toBe(true);
  });
});

describe('getAreaPath', () => {
  it('closes a line down to the baseline.', () => {
    expect(getAreaPath('M0,100L150,60', POINTS, 200)).toBe('M0,100L150,60L150,200L0,200Z');
  });

  it('returns an empty path without points.', () => {
    expect(getAreaPath('', [], 200)).toBe('');
  });
});

describe('getBandPath', () => {
  it('joins the upper line to the reversed lower line.', () => {
    expect(getBandPath('M0,10L100,20', 'M100,50L0,40')).toBe('M0,10L100,20L100,50L0,40Z');
  });

  it('returns an empty path if either line is empty.', () => {
    expect(getBandPath('', 'M100,50L0,40')).toBe('');
    expect(getBandPath('M0,10L100,20', '')).toBe('');
  });
});
