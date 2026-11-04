import { ChartGraphAxis, ChartGraphCategoryAxis } from './ChartGraph.types';

const NICE_STEPS = [1, 2, 2.5, 5, 10];

/**
 * Gets how many steps a category axis is divided into: one band per category, or one gap between
 * each pair of neighbouring points.
 *
 * @param axis - The axis
 * @returns The number of steps, at least 1
 */
export const getCategorySteps = (axis: ChartGraphCategoryAxis): number => (
  Math.max(1, axis.placement === 'point' ? axis.values.length - 1 : axis.values.length)
);

/**
 * Gets how far along an axis a value lies, from 0 at the start of the axis to 1 at its end. The
 * start is the left of an x axis and the top of a y axis.
 *
 * @param axis - The axis
 * @param value - The value
 * @param isY - Whether the axis is a y axis, along which values grow upwards
 * @returns The fraction, or 0 for a category which isn't on the axis
 */
export const getAxisFraction = (axis: ChartGraphAxis, value: string | number, isY: boolean): number => {
  if (axis.type === 'category') {
    const index = axis.values.indexOf(String(value));
    if (index < 0) {
      return 0;
    }
    if (axis.placement === 'point') {
      return axis.values.length > 1 ? index / getCategorySteps(axis) : 0.5;
    }
    return (index + 0.5) / getCategorySteps(axis);
  }
  const min = axis.ticks[0] ?? 0;
  const max = axis.ticks[axis.ticks.length - 1] ?? 1;
  const fraction = max === min ? 0 : (Number(value) - min) / (max - min);
  return isY ? 1 - fraction : fraction;
};

/**
 * Gets the position of a fraction of an axis, in pixels, between the axis' padding.
 *
 * @param fraction - The fraction, from `getAxisFraction`
 * @param length - The length of the plot along the axis
 * @param padding - The padding at each end of the axis
 * @returns The position
 */
export const getAxisPosition = (fraction: number, length: number, padding: number): number => (
  padding + fraction * (length - padding * 2)
);

/**
 * Gets the size of each step of a category axis, in pixels: each category's band, or the gap
 * between neighbouring points.
 *
 * @param axis - The axis
 * @param length - The length of the plot along the axis
 * @param padding - The padding at each end of the axis
 * @returns The size, or 0 for a value axis
 */
export const getAxisBand = (axis: ChartGraphAxis, length: number, padding: number): number => (
  axis.type === 'category' ? (length - padding * 2) / getCategorySteps(axis) : 0
);

/**
 * Gets evenly spaced round values from 0, or from the lowest value if it is negative, up to at
 * least the highest value, to mark on a value axis.
 *
 * @param values - The values the axis shows
 * @param count - Roughly how many intervals to split the axis into
 * @returns The ticks
 */
export const getNiceTicks = (values: number[], count = 4): number[] => {
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  if (max === min) {
    return [min, min + 1];
  }
  const rawStep = (max - min) / count;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = (NICE_STEPS.find((nice) => nice * magnitude >= rawStep) ?? 10) * magnitude;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round((end - start) / step) + 1 }, (_, i) => (
    Number((start + i * step).toPrecision(12))
  ));
};
