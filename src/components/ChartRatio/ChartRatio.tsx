import { ReactElement } from 'react';
import clsx from 'clsx';

import { Chart, ChartTooltipContent } from '../Chart';
import { getBarExtent, getBarSegments } from '../ChartBar/ChartBar.utils';
import { ChartPieSlice } from '../ChartPie/ChartPie.types';
import { getSliceTooltip, groupSmallSlices } from '../ChartPie/ChartPie.utils';

import styles from './ChartRatio.module.scss';

const DEFAULT_SPACING = 2;
const DEFAULT_CORNER_RADIUS = 4;
const DEFAULT_THICKNESS = 24;
const OTHER_KEY = '__other__';

export interface ChartRatioProps {
  className?: string;

  /**
   * The radius of each segment's corners, in pixels. It shrinks to fit thin
   * segments. Defaults to 4.
   */
  cornerRadius?: number;

  /**
   * The segments, in order from left to right. They take the same data as
   * `ChartPie`'s slices.
   */
  data: ChartPieSlice[];

  /**
   * The share of the bar the segments fill together, from 0 to 1, to show a
   * proportion of a proportion. Defaults to 1.
   */
  fill?: number;

  /**
   * Formats the values in the tooltip. Defaults to `String`.
   */
  formatValue?: (value: number) => string;

  /**
   * The color of the "Other" segment, as any CSS color.
   */
  otherColor?: string;

  /**
   * The name of the "Other" segment. Defaults to `Other`.
   */
  otherLabel?: string;

  /**
   * The share of the total, from 0 to 1, below which segments are folded into a
   * single "Other" segment. Defaults to 0, which folds nothing.
   */
  otherThreshold?: number;

  /**
   * The color of a segment filling the rest of the bar when `fill` is below 1,
   * as any CSS color. Without it, the rest of the bar is left empty.
   */
  remainderColor?: string;

  /**
   * The gap between neighboring segments, in pixels. Defaults to 2.
   */
  spacing?: number;

  /**
   * The height of the bar, in pixels. Defaults to 24.
   */
  thickness?: number;
}

/* A single bar split into segments by their share of a total, like a pie laid
 * out in a line.
 */
export const ChartRatio = ({
  className,
  cornerRadius = DEFAULT_CORNER_RADIUS,
  data,
  fill = 1,
  formatValue = String,
  otherColor = 'var(--color-text-muted)',
  otherLabel = 'Other',
  otherThreshold = 0,
  remainderColor,
  spacing = DEFAULT_SPACING,
  thickness = DEFAULT_THICKNESS,
}: ChartRatioProps): ReactElement => {
  const slices = groupSmallSlices(data, otherThreshold, {
    key: OTHER_KEY,
    color: otherColor,
    label: otherLabel,
  });
  const total = slices.reduce((sum, { value }) => sum + Math.max(0, value), 0);
  const filled = Math.min(1, Math.max(0, fill));
  const hasRemainder = !!remainderColor && filled < 1;

  // Segments are laid out as shares of the bar, with the remainder last:
  const shares = slices.map(({ value }) => (total ? (Math.max(0, value) / total) * filled : 0));
  const segments = getBarSegments(hasRemainder ? [...shares, 1 - filled] : shares, 0, true, spacing);

  const getTooltip = (key: string): ChartTooltipContent | undefined => {
    const slice = slices.find((s) => s.key === key);
    return slice && total > 0 ? getSliceTooltip(slice, total, formatValue) : undefined;
  };

  return (
    <Chart
      className={clsx(styles.chartRatio, className)}
      getTooltip={getTooltip}
      style={{ height: thickness }}
    >
      {({ activeKey, getItemHandlers, width }) => (
        <svg className={styles.chartRatioSvg}>
          {width > 0 && segments.map(({
            index,
            from,
            to,
            startInset,
            endInset,
          }) => {
            const { position, length } = getBarExtent(from * width, to * width, startInset, endInset);
            const rx = Math.min(cornerRadius, thickness / 2, length / 2);
            if (index === slices.length) {
              return (
                <rect
                  className={styles.chartRatioRemainder}
                  fill={remainderColor}
                  height={thickness}
                  key="remainder"
                  rx={rx}
                  width={length}
                  x={position}
                />
              );
            }
            const { color, key } = slices[index];
            return (
              <rect
                className={styles.chartRatioSegment}
                data-dimmed={activeKey !== undefined && activeKey !== key ? '' : undefined}
                fill={color}
                height={thickness}
                key={key}
                rx={rx}
                width={length}
                x={position}
                {...getItemHandlers(key)}
              />
            );
          })}
        </svg>
      )}
    </Chart>
  );
};

ChartRatio.displayName = 'ChartRatio';
