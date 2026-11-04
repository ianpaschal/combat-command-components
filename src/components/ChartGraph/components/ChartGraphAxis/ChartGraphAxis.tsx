import {
  CSSProperties,
  forwardRef,
  Ref,
} from 'react';
import clsx from 'clsx';

import { ChartGraphAxis as ChartGraphAxisConfig } from '../../ChartGraph.types';
import { getAxisFraction } from '../../ChartGraph.utils';

import styles from './ChartGraphAxis.module.scss';

export interface ChartGraphAxisProps {
  axis: ChartGraphAxisConfig;
  className?: string;
  isY: boolean;

  /**
   * A ref to the last label, to measure how far it overhangs the end of the axis.
   */
  lastLabelRef?: Ref<HTMLSpanElement>;

  /**
   * The padding at each end of the axis, in pixels.
   */
  padding: number;
}

const getLabels = (axis: ChartGraphAxisConfig): { key: string; label: string; value: string | number }[] => (
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

/* Labels an axis of a `ChartGraph`. Each label sits centered on its value, at the same position as
 * in the plot.
 */
export const ChartGraphAxis = forwardRef<HTMLDivElement, ChartGraphAxisProps>(({
  axis,
  className,
  isY,
  lastLabelRef,
  padding,
}, ref) => (
  <div className={clsx(styles.chartGraphAxis, isY ? styles.chartGraphAxisY : styles.chartGraphAxisX, className)} ref={ref}>
    {getLabels(axis).map(({ key, label, value }, i, labels) => (
      <span
        className={styles.chartGraphAxisLabel}
        key={key}
        ref={i === labels.length - 1 ? lastLabelRef : undefined}
        style={{
          '--fraction': getAxisFraction(axis, value, isY),
          '--padding': `${padding}px`,
        } as CSSProperties}
      >
        {label}
      </span>
    ))}
  </div>
));

ChartGraphAxis.displayName = 'ChartGraphAxis';
