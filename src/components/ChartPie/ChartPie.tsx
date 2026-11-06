import {
  CSSProperties,
  PointerEvent,
  ReactElement,
  useState,
} from 'react';
import clsx from 'clsx';

import { ChartGraphTooltip } from '../ChartGraph';
import { useElementSize, usePointerDownOutside } from '../ChartGraph/ChartGraph.hooks';
import { getTooltipStyle } from '../ChartGraph/ChartGraph.utils';
import { ChartPieAngles, ChartPieSlice } from './ChartPie.types';
import {
  getSliceAngles,
  getSlicePath,
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

type ActiveSlice = {
  key: string;
  tooltipStyle: CSSProperties;
};

export interface ChartPieProps {
  className?: string;

  /**
   * The radius of each slice's corners, in pixels. It shrinks to fit thin slices and narrow rings.
   * Defaults to 4.
   */
  cornerRadius?: number;

  /**
   * The slices, in order from the origin.
   */
  data: ChartPieSlice[];

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
   * The radius of the hole in the middle, as a fraction of the pie's radius, for a donut. Defaults
   * to 0, for a full pie.
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
   * The share of the total, from 0 to 1, below which slices are folded into a single "Other"
   * slice. Defaults to 0, which folds nothing.
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

/**
 * Formats a share of a total as a whole percentage.
 */
const formatShare = (share: number): string => `${Math.round(share * 100)}%`;

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
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();
  const [active, setActive] = useState<ActiveSlice>();
  usePointerDownOutside(ref, !!active, () => setActive(undefined));

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

  /* The pie is sized and centered on the part of the circle it spans. */
  const bounds = getSweepBounds(spannedSweep, rotation, isCounterclockwise, innerRadius);
  const radius = Math.max(0, Math.min(
    width / (bounds.maxX - bounds.minX || 1),
    height / (bounds.maxY - bounds.minY || 1),
  ));
  const cx = width / 2 - radius * (bounds.minX + bounds.maxX) / 2;
  const cy = height / 2 - radius * (bounds.minY + bounds.maxY) / 2;
  const getPath = (sliceAngles: ChartPieAngles): string => getSlicePath({
    cx,
    cy,
    outerRadius: radius,
    innerRadius: radius * innerRadius,
    angles: sliceAngles,
    spacing,
    cornerRadius,
    rotation,
    isCounterclockwise,
  });

  const getActiveSlice = (key: string, event: PointerEvent<SVGPathElement>): ActiveSlice | undefined => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? { key, tooltipStyle: getTooltipStyle(event.clientX, event.clientY, rect) } : undefined;
  };

  const handlePointerMove = (key: string, event: PointerEvent<SVGPathElement>): void => {
    if (event.pointerType !== 'touch') {
      setActive(getActiveSlice(key, event));
    }
  };

  const handlePointerLeave = (event: PointerEvent<SVGPathElement>): void => {
    if (event.pointerType !== 'touch') {
      setActive(undefined);
    }
  };

  /* Touch screens select a slice by tapping it, and clear it by tapping it again. */
  const handlePointerUp = (key: string, event: PointerEvent<SVGPathElement>): void => {
    if (event.pointerType === 'touch') {
      const next = getActiveSlice(key, event);
      setActive((current) => (current?.key === key ? undefined : next));
    }
  };

  const renderTooltip = (): ReactElement | null => {
    const slice = slices.find(({ key }) => key === active?.key);
    if (!slice || !total) {
      return null;
    }
    const rows = slice.children ?? [slice];
    return (
      <ChartGraphTooltip
        rows={rows.map(({ color, label, value }) => ({
          color,
          label,
          value: `${formatValue(value)} (${formatShare(value / total)})`,
        }))}
        title={slice.children ? `${slice.label} (${formatShare(slice.value / total)})` : slice.label}
      />
    );
  };

  return (
    <div className={clsx(styles.chartPie, className)} ref={ref}>
      <svg className={styles.chartPieSvg}>
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
            data-dimmed={active && active.key !== key ? '' : undefined}
            fill={color}
            key={key}
            onPointerLeave={handlePointerLeave}
            onPointerMove={(event) => handlePointerMove(key, event)}
            onPointerUp={(event) => handlePointerUp(key, event)}
          />
        ))}
      </svg>
      {active && (
        <div className={styles.chartPieTooltip} style={active.tooltipStyle}>
          {renderTooltip()}
        </div>
      )}
    </div>
  );
};

ChartPie.displayName = 'ChartPie';
