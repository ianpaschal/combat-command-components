import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  getBarExtent,
  getBarSegments,
  getBarSizes,
} from './ChartBar.utils';

describe('getBarSizes', () => {
  it('fills the group with a single bar.', () => {
    expect(getBarSizes(30, 1, 2)).toEqual({ thickness: 30, groupSize: 30 });
  });

  it('splits the group between bars, after the spacing.', () => {
    expect(getBarSizes(34, 3, 2)).toEqual({ thickness: 10, groupSize: 34 });
  });

  it('uses a fixed bar size, growing the group to fit.', () => {
    expect(getBarSizes(34, 3, 2, 16)).toEqual({ thickness: 16, groupSize: 52 });
  });

  it('never makes bars thinner than 0.', () => {
    expect(getBarSizes(4, 3, 4).thickness).toBe(0);
  });

  it('treats an empty group as a single bar.', () => {
    expect(getBarSizes(30, 0, 2)).toEqual({ thickness: 30, groupSize: 30 });
  });
});

describe('getBarSegments', () => {
  it('runs grouped bars from the baseline.', () => {
    expect(getBarSegments([10, 20], 0, false, 2)).toEqual([
      { index: 0, from: 0, to: 10, startInset: 0, endInset: 0 },
      { index: 1, from: 0, to: 20, startInset: 0, endInset: 0 },
    ]);
  });

  it('runs stacked bars on from the one before, splitting the spacing between them.', () => {
    expect(getBarSegments([0.5, 0.2, 0.3], 0, true, 2)).toEqual([
      { index: 0, from: 0, to: 0.5, startInset: 0, endInset: 1 },
      { index: 1, from: 0.5, to: 0.7, startInset: 1, endInset: 1 },
      { index: 2, from: 0.7, to: 1, startInset: 1, endInset: 0 },
    ]);
  });

  it('skips series with a value of 0, keeping the others\' indexes.', () => {
    expect(getBarSegments([5, 0, 5], 0, true, 2)).toEqual([
      { index: 0, from: 0, to: 5, startInset: 0, endInset: 1 },
      { index: 2, from: 5, to: 10, startInset: 1, endInset: 0 },
    ]);
  });

  it('starts from the baseline.', () => {
    expect(getBarSegments([10], 5, false, 0)[0]).toMatchObject({ from: 5, to: 10 });
  });
});

describe('getBarExtent', () => {
  it('measures a bar running forwards, as horizontal bars do.', () => {
    expect(getBarExtent(0, 100, 0, 0)).toEqual({ position: 0, length: 100 });
  });

  it('measures a bar running backwards, as vertical bars do.', () => {
    expect(getBarExtent(200, 100, 0, 0)).toEqual({ position: 100, length: 100 });
  });

  it('pulls in both ends of a bar running forwards.', () => {
    expect(getBarExtent(0, 100, 1, 2)).toEqual({ position: 1, length: 97 });
  });

  it('pulls in both ends of a bar running backwards.', () => {
    expect(getBarExtent(200, 100, 1, 2)).toEqual({ position: 102, length: 97 });
  });

  it('gives a length of 0 when the insets meet.', () => {
    expect(getBarExtent(0, 1, 1, 1).length).toBe(0);
  });
});
