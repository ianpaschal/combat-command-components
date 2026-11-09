import {
  ChartPlotAxis,
  ChartPlotAxisPadding,
  ChartPlotCategoryAxis,
} from './ChartPlot.types';

const NICE_STEPS = [1, 2, 2.5, 5, 10];

/**
 * Gets how many steps a category axis is divided into: one band per category,
 * or one gap between each pair of neighboring points.
 *
 * @param axis - The axis
 * @returns The number of steps, at least 1
 */
export const getCategorySteps = (axis: ChartPlotCategoryAxis): number => (
  Math.max(1, axis.placement === 'point' ? axis.values.length - 1 : axis.values.length)
);

/**
 * Gets how far along an axis a value lies, from 0 at the start of the axis to 1
 * at its end. The start is the left of an x axis and the top of a y axis.
 *
 * @param axis - The axis
 * @param value - The value
 * @param isY - Whether the axis is a y axis, along which values grow upwards
 * @returns The fraction, or 0 for a category which isn't on the axis
 */
export const getAxisFraction = (
  axis: ChartPlotAxis,
  value: string | number,
  isY: boolean,
): number => {
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
 * Gets the position of a fraction of an axis, in pixels, between the axis'
 * padding.
 *
 * @param fraction - The fraction, from `getAxisFraction`
 * @param length - The length of the plot along the axis
 * @param padding - The padding at each end of the axis
 * @returns The position
 */
export const getAxisPosition = (
  fraction: number,
  length: number,
  padding: ChartPlotAxisPadding,
): number => (
  padding.start + fraction * (length - padding.start - padding.end)
);

/**
 * Gets the size of each step of a category axis, in pixels: each category's
 * band, or the gap between neighboring points.
 *
 * @param axis - The axis
 * @param length - The length of the plot along the axis
 * @param padding - The padding at each end of the axis
 * @returns The size, or 0 for a value axis
 */
export const getAxisBand = (
  axis: ChartPlotAxis,
  length: number,
  padding: ChartPlotAxisPadding,
): number => (
  axis.type === 'category' ? (length - padding.start - padding.end) / getCategorySteps(axis) : 0
);

/**
 * Gets the fixed length of the plot along an axis, if the axis' ticks have a
 * fixed size.
 *
 * @param axis - The axis
 * @param padding - The padding at each end of the axis
 * @returns The length, or nothing if the plot fills the space it has
 */
export const getFixedLength = (
  axis: ChartPlotAxis,
  padding: ChartPlotAxisPadding,
): number | undefined => {
  if (!axis.tickSize) {
    return undefined;
  }
  const steps = axis.type === 'category' ? getCategorySteps(axis) : Math.max(1, axis.ticks.length - 1);
  return steps * axis.tickSize + padding.start + padding.end;
};

/**
 * Gets the category a key moves the selection to. The arrow keys step to the
 * next or previous category, and Home and End jump to the first or last. With
 * nothing selected, stepping forward starts at the first category and stepping
 * back at the last.
 *
 * @param key - The key's name, as in `KeyboardEvent.key`
 * @param index - The index of the selected category, or -1 if there is none
 * @param count - How many categories there are
 * @returns The index of the category to select, or `undefined` if the key
 *   doesn't move the selection
 */
export const getKeyboardIndex = (key: string, index: number, count: number): number | undefined => {
  if (!count) {
    return undefined;
  }
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return index < 0 ? 0 : Math.min(index + 1, count - 1);
    case 'ArrowLeft':
    case 'ArrowUp':
      return index < 0 ? count - 1 : Math.max(index - 1, 0);
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return undefined;
  }
};

/**
 * Gets evenly spaced round values from 0, or from the lowest value if it is
 * negative, up to at least the highest value, to mark on a value axis.
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
  const step = Math.min(...NICE_STEPS.filter((nice) => nice * magnitude >= rawStep)) * magnitude;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round((end - start) / step) + 1 }, (_, i) => (
    Number((start + i * step).toPrecision(12))
  ));
};
