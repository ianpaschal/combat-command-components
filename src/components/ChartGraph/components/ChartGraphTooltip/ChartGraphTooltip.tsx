import { ReactElement } from 'react';

import { sx } from '../../../../utils';

import styles from './ChartGraphTooltip.module.scss';

export type ChartGraphTooltipRow = {

  /**
   * The color of the row's series, as any CSS color.
   */
  color: string;
  label: string;
  value: string;
};

export interface ChartGraphTooltipProps {
  rows: ChartGraphTooltipRow[];
  title: string;
}

/* The content of a chart's tooltip: the hovered category, and one row per series. */
export const ChartGraphTooltip = ({
  rows,
  title,
}: ChartGraphTooltipProps): ReactElement => (
  <div className={sx({ variant: 'solid', corners: 'wide', elevation: 5 }, styles.chartGraphTooltip)}>
    <div className={styles.chartGraphTooltipTitle}>{title}</div>
    {rows.map(({ color, label, value }) => (
      <div className={styles.chartGraphTooltipRow} key={label}>
        <span className={styles.chartGraphTooltipSwatch} style={{ backgroundColor: color }} />
        <span className={styles.chartGraphTooltipLabel}>{label}</span>
        <span className={styles.chartGraphTooltipValue}>{value}</span>
      </div>
    ))}
  </div>
);

ChartGraphTooltip.displayName = 'ChartGraphTooltip';
