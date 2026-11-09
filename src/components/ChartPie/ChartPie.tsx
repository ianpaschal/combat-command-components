import { ReactElement, ReactNode } from 'react';
import clsx from 'clsx';

import {
  Chart,
  ChartRenderProps,
  ChartTooltipContent,
} from '../Chart';
import { ChartPieAngles, ChartPieGroupedSlice } from './ChartPie.types';
import {
  getSliceAngles,
  getSlicePath,
  getSliceTooltip,
  getSweepBounds,
  groupSmallSlices,
} from './ChartPie.utils';

import styles from './ChartPie.module.scss';

const DEFAULT_SPACING = 2;
const DEFAULT_CORNER_RADIUS = 4;
const OTHER_KEY = '__other__';
const ORIGIN_ROTATIONS = {
  top: 0,
  right: Math.PI / 2,
  bottom: Math.PI,
  left: Math.PI * 1.5,
};

export interface ChartPieProps {
  className?: string;

  /**
   * The radius of each slice's corners, in pixels. It shrinks to fit thin
   * slices and narrow rings. Defaults to 4 (px).
   */
  cornerRadius?: number;

  /**
   * The slices, in order from the origin. A slice which stands for several
   * others, such as an "Other" slice folded before the chart gets it, can list
   * them as `children` to show them in its tooltip.
   */
  data: ChartPieGroupedSlice[];

  /**
   * Which way the slices run from the origin. Defaults to `clockwise`.
   */
  direction?: 'clockwise' | 'counterclockwise';

  /**
   * The share of the sweep the slices fill together, from 0 to 1, to show a
   * proportion of a proportion. Defaults to 1.
   */
  fill?: number;

  /**
   * Formats the values in the tooltip. Defaults to `String`.
   */
  formatValue?: (value: number) => string;

  /**
   * The radius of the hole in the middle, as a fraction of the pie's radius,
   * for a donut. Defaults to 0, for a full pie.
   */
  innerRadius?: number;

  /**
   * Where the first slice starts. Defaults to `top`.
   */
  origin?: 'top' | 'right' | 'bottom' | 'left';

  /**
   * The color of the "Other" slice, as any CSS color.
   */
  otherColor?: string;

  /**
   * The name of the "Other" slice. Defaults to `Other`.
   */
  otherLabel?: string;

  /**
   * The share of the total, from 0 to 1, below which slices are folded into a
   * single "Other" slice. Defaults to 0, which folds nothing.
   */
  otherThreshold?: number;

  /**
   * The color of a segment filling the rest of the sweep when `fill` is
   * below 1, as any CSS color. Without it, the rest of the sweep is left empty.
   */
  remainderColor?: string;

  /**
   * The gap between neighboring slices, in pixels. Defaults to 2.
   */
  spacing?: number;

  /**
   * The share of the circle the chart spans, from 0 to 1. A sweep of 0.5 with a
   * `left` origin makes a hemisphere chart. The chart is sized and centered on
   * the part of the circle it spans. Defaults to 1.
   */
  sweep?: number;
}

export const ChartPie = ({
  className,
  cornerRadius = DEFAULT_CORNER_RADIUS,
  data,
  direction = 'clockwise',
  fill = 1,
  formatValue = String,
  innerRadius = 0,
  origin = 'top',
  otherColor = 'var(--color-text-muted)',
  otherLabel = 'Other',
  otherThreshold = 0,
  remainderColor,
  spacing = DEFAULT_SPACING,
  sweep = 1,
}: ChartPieProps): ReactElement => {
  const slices = groupSmallSlices(data, otherThreshold, {
    key: OTHER_KEY,
    color: otherColor,
    label: otherLabel,
  });
  const total = slices.reduce((sum, { value }) => sum + Math.max(0, value), 0);
  const spannedSweep = Math.min(1, Math.max(0, sweep));
  const filledSweep = spannedSweep * Math.min(1, Math.max(0, fill));
  const angles = getSliceAngles(slices.map(({ value }) => value), filledSweep);
  const hasRemainder = !!remainderColor && filledSweep < spannedSweep;
  const rotation = ORIGIN_ROTATIONS[origin];
  const isCounterclockwise = direction === 'counterclockwise';

  /* The SVG takes the shape of the part of the circle the pie spans, so a half
   * pie is twice as wide as it is tall, and is as big as fits in the chart.
   * Without a height to fit, the pie fits the width and the chart grows to it.
   */
  const bounds = getSweepBounds(spannedSweep, rotation, isCounterclockwise, innerRadius);
  const boundsWidth = bounds.maxX - bounds.minX || 1;
  const boundsHeight = bounds.maxY - bounds.minY || 1;

  const getTooltip = (key: string): ChartTooltipContent | undefined => {
    const slice = slices.find((s) => s.key === key);
    return slice && total > 0 ? getSliceTooltip(slice, total, formatValue) : undefined;
  };

  const renderPie = ({
    activeKey,
    getItemHandlers,
    height,
    width,
  }: ChartRenderProps): ReactNode => {
    const radius = Math.max(0, height > 0 ? (
      Math.min(width / boundsWidth, height / boundsHeight)
    ) : (
      width / boundsWidth
    ));
    const getPath = (sliceAngles: ChartPieAngles): string => getSlicePath({
      cx: -radius * bounds.minX,
      cy: -radius * bounds.minY,
      outerRadius: radius,
      innerRadius: radius * innerRadius,
      angles: sliceAngles,
      spacing,
      cornerRadius,
      rotation,
      isCounterclockwise,
    });
    return (
      <svg
        className={styles.chartPieSvg}
        height={radius * boundsHeight}
        width={radius * boundsWidth}
      >
        {radius > 0 && hasRemainder && (
          <path
            className={styles.chartPieRemainder}
            d={getPath({ start: Math.PI * 2 * filledSweep, end: Math.PI * 2 * spannedSweep })}
            fill={remainderColor}
          />
        )}
        {radius > 0 && slices.map(({ color, key }, i) => (
          <path
            className={styles.chartPieSlice}
            d={getPath(angles[i])}
            data-dimmed={activeKey !== undefined && activeKey !== key ? '' : undefined}
            fill={color}
            key={key}
            {...getItemHandlers(key)}
          />
        ))}
      </svg>
    );
  };

  return (
    <Chart
      className={clsx(styles.chartPie, className)}
      getTooltip={getTooltip}
      style={{ aspectRatio: `${boundsWidth} / ${boundsHeight}` }}
    >
      {renderPie}
    </Chart>
  );
};

ChartPie.displayName = 'ChartPie';
