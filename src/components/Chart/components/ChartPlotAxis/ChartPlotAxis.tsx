import { CSSProperties, forwardRef } from 'react';
import clsx from 'clsx';

import {
  ChartPlotAxis as ChartPlotAxisConfig,
  ChartPlotAxisPadding,
  ChartPlotAxisSide,
  ChartPlotEdgeLabels,
} from '../ChartPlot/ChartPlot.types';
import { getAxisFraction } from '../ChartPlot/ChartPlot.utils';

import styles from './ChartPlotAxis.module.scss';

export interface ChartPlotAxisProps {
  axis: ChartPlotAxisConfig;
  className?: string;

  /**
   * How the labels at the very ends of the axis sit: moved inward to end at
   * the ends of the axis, or centered on their values.
   */
  edgeLabels: ChartPlotEdgeLabels;

  /**
   * The padding at each end of the axis, in pixels.
   */
  padding: ChartPlotAxisPadding;

  /**
   * Which side of the plot the axis sits on. Top and bottom axes are x axes,
   * and left and right axes are y axes. The labels sit on the side facing the
   * plot.
   */
  side: ChartPlotAxisSide;
}

const getLabels = (axis: ChartPlotAxisConfig): { key: string; label: string; value: string | number }[] => (
  axis.type === 'category' ? (
    (axis.ticks ?? axis.values).map((value) => ({
      key: value,
      label: axis.formatTick ? axis.formatTick(value) : value,
      value,
    }))
  ) : (
    axis.ticks.map((value) => ({
      key: String(value),
      label: axis.formatTick ? axis.formatTick(value) : String(value),
      value,
    }))
  )
);

/**
 * Gets which end of the axis a label sits at, if any.
 *
 * @param fraction - How far along the axis the label's value lies, from 0 to 1
 * @returns The end, or nothing for a label between the ends
 */
const getEdge = (fraction: number): 'start' | 'end' | undefined => {
  if (fraction === 0) {
    return 'start';
  }
  if (fraction === 1) {
    return 'end';
  }
  return undefined;
};

/* Labels an axis of a `ChartPlot`. Each label sits centered on its value, at
 * the same position as in the plot. Labels at the very ends of the axis can
 * instead be moved inward, to end at the ends of the axis.
 */
export const ChartPlotAxis = forwardRef<HTMLDivElement, ChartPlotAxisProps>(({
  axis,
  className,
  edgeLabels,
  padding,
  side,
}, ref) => {
  const isY = side === 'left' || side === 'right';
  return (
    <div
      className={clsx(styles.chartPlotAxis, isY ? styles.chartPlotAxisY : styles.chartPlotAxisX, className)}
      data-side={side}
      ref={ref}
    >
      {getLabels(axis).map(({ key, label, value }) => {
        const fraction = getAxisFraction(axis, value, isY);
        return (
          <span
            className={styles.chartPlotAxisLabel}
            data-edge={edgeLabels === 'shift' ? getEdge(fraction) : undefined}
            key={key}
            style={{
              '--fraction': fraction,
              '--padding-start': `${padding.start}px`,
              '--padding-end': `${padding.end}px`,
            } as CSSProperties}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
});

ChartPlotAxis.displayName = 'ChartPlotAxis';
