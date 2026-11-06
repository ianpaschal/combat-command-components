import {
  describe,
  expect,
  it,
} from 'vitest';

import { ChartPlotCategoryAxis, ChartPlotValueAxis } from './ChartPlot.types';
import {
  getAxisBand,
  getAxisFraction,
  getAxisPosition,
  getCategorySteps,
  getFixedLength,
  getNiceTicks,
} from './ChartPlot.utils';

const BAND_AXIS: ChartPlotCategoryAxis = { type: 'category', values: ['a', 'b', 'c', 'd'] };
const POINT_AXIS: ChartPlotCategoryAxis = { ...BAND_AXIS, placement: 'point' };
const VALUE_AXIS: ChartPlotValueAxis = { type: 'value', ticks: [0, 25, 50, 75, 100] };

describe('getCategorySteps', () => {
  it('has one step per band.', () => {
    expect(getCategorySteps(BAND_AXIS)).toBe(4);
  });

  it('has one step between each pair of points.', () => {
    expect(getCategorySteps(POINT_AXIS)).toBe(3);
  });

  it('has at least one step.', () => {
    expect(getCategorySteps({ ...POINT_AXIS, values: ['a'] })).toBe(1);
    expect(getCategorySteps({ ...BAND_AXIS, values: [] })).toBe(1);
  });
});

describe('getAxisFraction', () => {
  it('puts bands at the middle of their band.', () => {
    expect(getAxisFraction(BAND_AXIS, 'a', false)).toBe(0.125);
    expect(getAxisFraction(BAND_AXIS, 'd', false)).toBe(0.875);
  });

  it('puts the first and last points at the ends of the axis.', () => {
    expect(getAxisFraction(POINT_AXIS, 'a', false)).toBe(0);
    expect(getAxisFraction(POINT_AXIS, 'b', false)).toBeCloseTo(1 / 3);
    expect(getAxisFraction(POINT_AXIS, 'd', false)).toBe(1);
  });

  it('centers a single point.', () => {
    expect(getAxisFraction({ ...POINT_AXIS, values: ['a'] }, 'a', false)).toBe(0.5);
  });

  it('returns 0 for a category which is not on the axis.', () => {
    expect(getAxisFraction(BAND_AXIS, 'z', false)).toBe(0);
  });

  it('places values linearly between the first and last ticks.', () => {
    expect(getAxisFraction(VALUE_AXIS, 0, false)).toBe(0);
    expect(getAxisFraction(VALUE_AXIS, 25, false)).toBe(0.25);
    expect(getAxisFraction(VALUE_AXIS, 100, false)).toBe(1);
  });

  it('inverts a value y axis, so values grow upwards.', () => {
    expect(getAxisFraction(VALUE_AXIS, 0, true)).toBe(1);
    expect(getAxisFraction(VALUE_AXIS, 100, true)).toBe(0);
  });

  it('returns 0 when the ticks have no range.', () => {
    expect(getAxisFraction({ type: 'value', ticks: [5] }, 5, false)).toBe(0);
  });

  it('runs from 0 to 1 without ticks.', () => {
    expect(getAxisFraction({ type: 'value', ticks: [] }, 0.25, false)).toBe(0.25);
  });
});

describe('getAxisPosition', () => {
  it('maps a fraction onto the length between the padding.', () => {
    expect(getAxisPosition(0, 200, 10)).toBe(10);
    expect(getAxisPosition(0.5, 200, 10)).toBe(100);
    expect(getAxisPosition(1, 200, 10)).toBe(190);
  });
});

describe('getAxisBand', () => {
  it('splits the length between the padding into steps.', () => {
    expect(getAxisBand(BAND_AXIS, 220, 10)).toBe(50);
    expect(getAxisBand(POINT_AXIS, 300, 0)).toBe(100);
  });

  it('returns 0 for a value axis.', () => {
    expect(getAxisBand(VALUE_AXIS, 200, 0)).toBe(0);
  });
});

describe('getFixedLength', () => {
  it('returns nothing without a tick size.', () => {
    expect(getFixedLength(BAND_AXIS, 10)).toBeUndefined();
    expect(getFixedLength(VALUE_AXIS, 10)).toBeUndefined();
  });

  it('sizes a category axis by its steps.', () => {
    expect(getFixedLength({ ...BAND_AXIS, tickSize: 32 }, 0)).toBe(128);
    expect(getFixedLength({ ...POINT_AXIS, tickSize: 48 }, 0)).toBe(144);
  });

  it('sizes a value axis by the gaps between its ticks.', () => {
    expect(getFixedLength({ ...VALUE_AXIS, tickSize: 40 }, 0)).toBe(160);
  });

  it('adds the padding at each end.', () => {
    expect(getFixedLength({ ...BAND_AXIS, tickSize: 32 }, 12)).toBe(152);
  });
});

describe('getNiceTicks', () => {
  it('runs from 0 to a round value above the highest value.', () => {
    expect(getNiceTicks([3, 47, 62])).toEqual([0, 20, 40, 60, 80]);
    expect(getNiceTicks([0.12, 0.95])).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('runs from a round value below the lowest negative value.', () => {
    expect(getNiceTicks([-30, 50])).toEqual([-40, -20, 0, 20, 40, 60]);
  });

  it('returns a unit range when every value is 0.', () => {
    expect(getNiceTicks([0, 0])).toEqual([0, 1]);
    expect(getNiceTicks([])).toEqual([0, 1]);
  });

  it('avoids floating point noise.', () => {
    expect(getNiceTicks([0.3])).toEqual([0, 0.1, 0.2, 0.3]);
  });
});
