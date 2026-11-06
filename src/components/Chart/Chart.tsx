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
   * Gets the tooltip of the selected item. Without it, or if it returns
   * nothing, there is no tooltip.
   */
  getTooltip?: (key: string) => ChartTooltipContent | undefined;
  style?: CSSProperties;
}

/* The root of every chart. It measures itself, tracks which item is selected,
 * and shows the selected item's tooltip.
 */
export const Chart = ({
  children,
  className,
  getTooltip,
  style,
}: ChartProps): ReactElement => {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const { active, getAreaHandlers, getItemHandlers } = useChartSelection(ref);
  const tooltip = active && getTooltip?.(active.key);
  return (
    <div className={clsx(styles.chart, className)} ref={ref} style={style}>
      {children({
        ...size,
        activeKey: active?.key,
        getAreaHandlers,
        getItemHandlers,
      })}
      {active && tooltip && (
        <ChartTooltip {...tooltip} x={active.x} y={active.y} />
      )}
    </div>
  );
};

Chart.displayName = 'Chart';
