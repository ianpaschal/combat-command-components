import {
  CSSProperties,
  ReactElement,
  ReactNode,
} from 'react';
import clsx from 'clsx';

import { ChartTooltip, ChartTooltipContent } from './components/ChartTooltip';
import {
  ChartSelection,
  ElementSize,
  useChartSelection,
  useElementSize,
} from './Chart.hooks';
import { getAnnouncement } from './Chart.utils';

import styles from './Chart.module.scss';

export type ChartRenderProps = ElementSize & Omit<ChartSelection, 'active'> & {

  /**
   * The key of the selected item, if any.
   */
  activeKey?: string;
};

export interface ChartProps {

  /**
   * Draws the chart from its size and selection.
   */
  children: (props: ChartRenderProps) => ReactNode;
  className?: string;

  /**
   * Gets where in the viewport to show the tooltip of an item selected with the
   * keyboard. Without it, or if it returns nothing, there is no tooltip for it.
   */
  getAnchor?: (key: string) => { x: number; y: number } | undefined;

  /**
   * Gets the tooltip of the selected item. Without it, or if it returns
   * nothing, there is no tooltip.
   */
  getTooltip?: (key: string) => ChartTooltipContent | undefined;
  style?: CSSProperties;
}

/* The root of every chart. It measures itself, tracks which item is selected,
 * and shows the selected item's tooltip. An item selected with the keyboard is
 * also announced to screen readers.
 */
export const Chart = ({
  children,
  className,
  getAnchor,
  getTooltip,
  style,
}: ChartProps): ReactElement => {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const {
    active,
    getAreaHandlers,
    getItemHandlers,
    select,
  } = useChartSelection(ref);
  const tooltip = active && getTooltip?.(active.key);
  const isKeyboardSelection = active !== undefined && active.x === undefined;
  const anchor = active && (isKeyboardSelection ? getAnchor?.(active.key) : { x: active.x ?? 0, y: active.y ?? 0 });
  return (
    <div className={clsx(styles.chart, className)} ref={ref} style={style}>
      {children({
        ...size,
        activeKey: active?.key,
        getAreaHandlers,
        getItemHandlers,
        select,
      })}
      {anchor && tooltip && (
        <ChartTooltip {...tooltip} x={anchor.x} y={anchor.y} />
      )}
      <div aria-live="polite" className={styles.chartAnnouncement}>
        {isKeyboardSelection && tooltip ? getAnnouncement(tooltip) : ''}
      </div>
    </div>
  );
};

Chart.displayName = 'Chart';
