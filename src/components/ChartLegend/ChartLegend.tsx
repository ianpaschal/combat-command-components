import { ReactElement } from 'react';
import clsx from 'clsx';

import styles from './ChartLegend.module.scss';

export type ChartLegendSeries = {
  key: string;

  /**
   * The color of the series, as any CSS color.
   */
  color: string;
  label: string;
};

export interface ChartLegendProps {

  /**
   * Where the series sit along each row. Defaults to `center`.
   */
  align?: 'start' | 'center' | 'end';
  className?: string;

  /**
   * The series to name, in order. Takes the same series as the charts. With
   * fewer than two, there is no legend.
   */
  series: ChartLegendSeries[];
}

/**
 * Names each series of a chart next to its color. It is separate from the
 * chart, so that it can be placed anywhere around it.
 */
export const ChartLegend = ({
  align = 'center',
  className,
  series,
}: ChartLegendProps): ReactElement | null => {
  if (series.length < 2) {
    return null;
  }
  return (
    <ul className={clsx(styles.chartLegend, className)} data-align={align}>
      {series.map(({ color, key, label }) => (
        <li className={styles.chartLegendItem} key={key}>
          <span className={styles.chartLegendSwatch} style={{ backgroundColor: color }} />
          {label}
        </li>
      ))}
    </ul>
  );
};

ChartLegend.displayName = 'ChartLegend';
