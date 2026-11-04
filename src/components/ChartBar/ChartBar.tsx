import { ReactElement } from 'react';

import {
  ChartGraph,
  ChartGraphCategoryAxis,
  ChartGraphPaddingProps,
  ChartGraphTooltip,
  ChartGraphValueAxis,
} from '../ChartGraph';
import { getNiceTicks } from '../ChartGraph/ChartGraph.utils';

import styles from './ChartBar.module.scss';

const BAR_RADIUS = 4;
const BAND_FILL = 0.6;

export type ChartBarDatum = {
  x: string;
  value: number;
};

export interface ChartBarProps extends ChartGraphPaddingProps {

  /**
   * The thickness of each bar, in pixels. Without it, bars fill most of their category's band.
   */
  barSize?: number;
  className?: string;

  /**
   * The color of the bars, as any CSS color.
   */
  color: string;

  /**
   * The bars, in order along the category axis.
   */
  data: ChartBarDatum[];

  /**
   * Formats the labels of the value axis. Defaults to `String`.
   */
  formatValue?: (value: number) => string;

  /**
   * What the bars show, as the name of their row in the tooltip.
   */
  label: string;

  /**
   * Which way the bars run. `vertical` bars stand up from the x axis, and `horizontal` bars run out
   * from the y axis. Defaults to `vertical`.
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * The space each bar's category gets along the category axis, in pixels. With it, the plot is
   * exactly as long as its bars need, and scrolls along the category axis when the chart has less
   * space. Without it, the plot fills the chart.
   */
  tickSize?: number;

  /**
   * The values to mark on the value axis. The axis runs from the first to the last. Without them,
   * the axis runs from 0 to a round value above the highest bar.
   */
  valueTicks?: number[];
}

export const ChartBar = ({
  barSize,
  className,
  color,
  data,
  formatValue,
  label,
  orientation = 'vertical',
  padding,
  paddingX,
  paddingY,
  tickSize,
  valueTicks = getNiceTicks(data.map(({ value }) => value)),
}: ChartBarProps): ReactElement => {
  const isHorizontal = orientation === 'horizontal';
  const categoryAxis: ChartGraphCategoryAxis = {
    type: 'category',
    values: data.map(({ x }) => x),
    tickSize,
  };
  const valueAxis: ChartGraphValueAxis = { type: 'value', ticks: valueTicks, formatTick: formatValue };
  const baseline = Math.min(Math.max(0, valueTicks[0] ?? 0), valueTicks[valueTicks.length - 1] ?? 0);
  const renderTooltip = (x: string): ReactElement => (
    <ChartGraphTooltip
      rows={data.filter((datum) => datum.x === x).map(({ value }) => ({
        color,
        label,
        value: formatValue ? formatValue(value) : String(value),
      }))}
      title={x}
    />
  );

  return (
    <ChartGraph
      className={className}
      padding={padding}
      paddingX={paddingX}
      paddingY={paddingY}
      renderTooltip={renderTooltip}
      x={isHorizontal ? valueAxis : categoryAxis}
      y={isHorizontal ? categoryAxis : valueAxis}
    >
      {({
        activeValue,
        bandX,
        bandY,
        getX,
        getY,
      }) => data.map(({ x, value }) => {
        const thickness = barSize ?? (isHorizontal ? bandY : bandX) * BAND_FILL;
        const start = isHorizontal ? getX(baseline) : getY(baseline);
        const end = isHorizontal ? getX(value) : getY(value);
        const length = Math.abs(end - start);
        const center = isHorizontal ? getY(x) : getX(x);
        return (
          <rect
            className={styles.chartBarBar}
            data-dimmed={activeValue !== undefined && activeValue !== x ? '' : undefined}
            fill={color}
            height={isHorizontal ? thickness : length}
            key={x}
            rx={Math.min(BAR_RADIUS, thickness / 2, length / 2)}
            width={isHorizontal ? length : thickness}
            x={isHorizontal ? Math.min(start, end) : center - thickness / 2}
            y={isHorizontal ? center - thickness / 2 : Math.min(start, end)}
          />
        );
      })}
    </ChartGraph>
  );
};

ChartBar.displayName = 'ChartBar';
