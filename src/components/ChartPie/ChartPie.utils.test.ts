import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  ChartPieBounds,
  ChartPieSlice,
  ChartPieSliceGeometry,
} from './ChartPie.types';
import {
  getSliceAngles,
  getSlicePath,
  getSweepBounds,
  groupSmallSlices,
} from './ChartPie.utils';

const OTHER = { key: 'other', color: 'grey', label: 'Other' };

const getSlices = (values: number[]): ChartPieSlice[] => (
  values.map((value, i) => ({ key: `s${i}`, color: 'blue', label: `Slice ${i}`, value }))
);

describe('groupSmallSlices', () => {
  it('folds slices below the threshold into an "Other" slice at the end.', () => {
    const slices = getSlices([50, 40, 6, 4]);
    expect(groupSmallSlices(slices, 0.1, OTHER)).toEqual([
      slices[0],
      slices[1],
      { ...OTHER, value: 10, children: [slices[2], slices[3]] },
    ]);
  });

  it('leaves a single small slice alone.', () => {
    const slices = getSlices([60, 35, 5]);
    expect(groupSmallSlices(slices, 0.1, OTHER)).toBe(slices);
  });

  it('folds nothing with a threshold of 0.', () => {
    const slices = getSlices([90, 5, 5]);
    expect(groupSmallSlices(slices, 0, OTHER)).toBe(slices);
  });

  it('folds nothing when the total is 0.', () => {
    const slices = getSlices([0, 0]);
    expect(groupSmallSlices(slices, 0.5, OTHER)).toBe(slices);
  });
});

describe('getSliceAngles', () => {
  it('splits the circle by each value\'s share, clockwise from the top.', () => {
    const angles = getSliceAngles([1, 1, 2]);
    expect(angles[0]).toEqual({ start: 0, end: Math.PI / 2 });
    expect(angles[1]).toEqual({ start: Math.PI / 2, end: Math.PI });
    expect(angles[2]).toEqual({ start: Math.PI, end: Math.PI * 2 });
  });

  it('gives negative values no angle.', () => {
    const angles = getSliceAngles([-5, 10]);
    expect(angles[0]).toEqual({ start: 0, end: 0 });
    expect(angles[1]).toEqual({ start: 0, end: Math.PI * 2 });
  });

  it('gives every slice no angle when the total is 0.', () => {
    expect(getSliceAngles([0, 0])).toEqual([{ start: 0, end: 0 }, { start: 0, end: 0 }]);
  });

  it('splits only the swept share of the circle.', () => {
    const angles = getSliceAngles([1, 1], 0.5);
    expect(angles[0]).toEqual({ start: 0, end: Math.PI / 2 });
    expect(angles[1]).toEqual({ start: Math.PI / 2, end: Math.PI });
  });
});

describe('getSweepBounds', () => {
  const expectBounds = (bounds: ChartPieBounds, expected: ChartPieBounds): void => {
    Object.entries(expected).forEach(([key, value]) => {
      expect(bounds[key as keyof ChartPieBounds]).toBeCloseTo(value);
    });
  };

  it('covers the whole circle for a full sweep.', () => {
    expectBounds(getSweepBounds(1, 0, false, 0), { minX: -1, maxX: 1, minY: -1, maxY: 1 });
  });

  it('covers the top half for a hemisphere from the left.', () => {
    expectBounds(getSweepBounds(0.5, Math.PI * 1.5, false, 0), { minX: -1, maxX: 1, minY: -1, maxY: 0 });
  });

  it('covers the bottom half for a hemisphere from the left, counterclockwise.', () => {
    expectBounds(getSweepBounds(0.5, Math.PI * 1.5, true, 0), { minX: -1, maxX: 1, minY: 0, maxY: 1 });
  });

  it('covers a quarter from the top, including the center of a pie.', () => {
    expectBounds(getSweepBounds(0.25, 0, false, 0), { minX: 0, maxX: 1, minY: -1, maxY: 0 });
  });

  it('leaves out the hole of a donut.', () => {
    expectBounds(getSweepBounds(0.25, Math.PI / 4, false, 0.5), {
      minX: Math.SQRT1_2 / 2,
      maxX: 1,
      minY: -Math.SQRT1_2,
      maxY: Math.SQRT1_2,
    });
  });
});

describe('getSlicePath', () => {
  const QUARTER: ChartPieSliceGeometry = {
    cx: 50,
    cy: 50,
    outerRadius: 50,
    innerRadius: 0,
    angles: { start: 0, end: Math.PI / 2 },
    spacing: 0,
    cornerRadius: 0,
    rotation: 0,
    isCounterclockwise: false,
  };

  /**
   * Gets every point a path moves or draws a line to.
   */
  const getLinePoints = (path: string): number[][] => (
    [...path.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map(([, x, y]) => [Number(x), Number(y)])
  );

  it('returns an empty path for a slice with no angle.', () => {
    expect(getSlicePath({ ...QUARTER, angles: { start: 1, end: 1 } })).toBe('');
  });

  it('returns an empty path for a slice thinner than the spacing.', () => {
    expect(getSlicePath({ ...QUARTER, angles: { start: 0, end: 0.01 }, spacing: 2 })).toBe('');
  });

  it('draws a pie slice from the outer arc to the center.', () => {
    expect(getSlicePath(QUARTER)).toBe('M50,0A50,50 0 0 1 100,50L50,50Z');
  });

  it('draws a donut slice back along the inner arc.', () => {
    expect(getSlicePath({ ...QUARTER, innerRadius: 25 })).toBe('M50,0A50,50 0 0 1 100,50L75,50A25,25 0 0 0 50,25Z');
  });

  it('shifts each edge into the slice by half the spacing, so gaps have parallel sides.', () => {
    const [first, apex] = getLinePoints(getSlicePath({ ...QUARTER, spacing: 4 }));

    /* The start edge runs straight up, shifted 2 pixels right. */
    expect(first[0]).toBe(52);

    /* The edges meet 2 pixels in from both rays. */
    expect(apex).toEqual([52, 48]);
  });

  it('meets the hole with edges which stay shifted by half the spacing.', () => {
    const points = getLinePoints(getSlicePath({ ...QUARTER, innerRadius: 25, spacing: 4 }));
    expect(points[0][0]).toBe(52);
    expect(points[1][1]).toBe(48);
  });

  it('runs the edges of slices over half the circle to the center.', () => {
    const path = getSlicePath({ ...QUARTER, angles: { start: 0, end: Math.PI * 1.5 }, spacing: 4 });
    expect(path).toContain('A50,50 0 1 1');
    expect(getLinePoints(path).slice(1)).toEqual([[50, 52], [52, 50]]);
  });

  it('rounds each corner with an arc of the corner radius.', () => {
    expect(getSlicePath({ ...QUARTER, cornerRadius: 4 }).match(/A4,4/g)).toHaveLength(2);
    expect(getSlicePath({ ...QUARTER, innerRadius: 25, cornerRadius: 4 }).match(/A4,4/g)).toHaveLength(4);
  });

  it('shrinks the corner radius to fit a narrow ring.', () => {
    const path = getSlicePath({ ...QUARTER, innerRadius: 46, cornerRadius: 4 });
    expect(path).toContain('A2,2');
    expect(path).not.toContain('A4,4');
  });

  it('rotates the slice to start at the origin.', () => {
    const [first] = getLinePoints(getSlicePath({ ...QUARTER, spacing: 4, rotation: Math.PI / 2 }));

    /* Starting from the right, the start edge runs straight right, shifted 2 pixels down. */
    expect(first[1]).toBe(52);
  });

  it('mirrors the slice to run counterclockwise.', () => {
    expect(getSlicePath({ ...QUARTER, isCounterclockwise: true })).toBe('M50,0A50,50 0 0 0 0,50L50,50Z');
    expect(getSlicePath({ ...QUARTER, innerRadius: 25, isCounterclockwise: true }))
      .toBe('M50,0A50,50 0 0 0 0,50L25,50A25,25 0 0 1 50,25Z');
  });

  it('draws a whole circle as two halves, with no gap.', () => {
    const path = getSlicePath({ ...QUARTER, angles: { start: 0, end: Math.PI * 2 }, spacing: 2 });
    expect(path.match(/A/g)).toHaveLength(2);
  });

  it('cuts a hole in a whole donut.', () => {
    const path = getSlicePath({
      ...QUARTER,
      innerRadius: 25,
      angles: { start: 0, end: Math.PI * 2 },
      spacing: 2,
    });
    expect(path.match(/A/g)).toHaveLength(4);
  });
});
