import { ReactElement } from 'react';
import { createPortal } from 'react-dom';

import { sx } from '../../../../utils';
import { getTooltipStyle } from '../../Chart.utils';

import styles from './ChartTooltip.module.scss';

export type ChartTooltipRow = {

  /**
   * The color of the row's series, as any CSS color.
   */
  color: string;
  label: string;
  value: string;
};

export type ChartTooltipContent = {
  rows: ChartTooltipRow[];
  title: string;
};

export interface ChartTooltipProps extends ChartTooltipContent {

  /**
   * The pointer's horizontal position in the viewport.
   */
  x: number;

  /**
   * The pointer's vertical position in the viewport.
   */
  y: number;
}

/* A chart's tooltip: the hovered item, and one row per series. It is shown next
 * to the pointer, in a portal on the document's body, so that it is never
 * clipped by a card or scroll area around the chart.
 *
 * It is hidden from screen readers, which hear the chart's announcement instead.
 */
export const ChartTooltip = ({
  rows,
  title,
  x,
  y,
}: ChartTooltipProps): ReactElement => createPortal(
  <div
    aria-hidden
    className={styles.chartTooltipPortal}
    style={getTooltipStyle(x, y, window.innerWidth, window.innerHeight)}
  >
    <div className={sx({ variant: 'solid', corners: 'normal', elevation: 5 }, styles.chartTooltip)}>
      <div className={styles.chartTooltipTitle}>{title}</div>
      {rows.map(({ color, label, value }, i) => (
        <div className={styles.chartTooltipRow} key={i}>
          <span className={styles.chartTooltipSwatch} style={{ backgroundColor: color }} />
          <span className={styles.chartTooltipLabel}>{label}</span>
          <span className={styles.chartTooltipValue}>{value}</span>
        </div>
      ))}
    </div>
  </div>,
  document.body,
);

ChartTooltip.displayName = 'ChartTooltip';
