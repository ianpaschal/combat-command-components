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
const DEFAULT_SPACING = 2;

export type ChartBarSeries = {
  key: string;

  /**
   * The color of the series' bars, as any CSS color.
   */
  color: string;

  /**
   * What the series shows, as the name of its row in the tooltip.
   */
  label: string;
};

export type ChartBarDatum = {
  x: string;

  /**
   * The value of each series in this category, by series key. A missing value counts as 0.
   */
  values: Record<string, number>;
};

export interface ChartBarProps extends ChartGraphPaddingProps {

  /**
   * The thickness of each bar, in pixels. When grouped, this is the thickness of each series' bar.
   * Without it, each category's bars fill most of its band.
   */
  barSize?: number;

  /**
   * The space each bar's category gets along the category axis, in pixels. With it, the plot is
   * exactly as long as its bars need, and scrolls along the category axis when the chart has less
   * space. Without it, the plot fills the chart.
   */
  categoryTickSize?: number;

  /** The categories to label. Without them, every category is labelled. */
  categoryTicks?: string[];
  className?: string;

  /** The categories, in order along the category axis. */
  data: ChartBarDatum[];

  /** Formats the labels of the value axis and the values in the tooltip. */
  formatValue?: (value: number) => string;

  /** How the series of a category are drawn. */
  mode?: 'grouped' | 'stacked';

  /** Which direction the bars run. */
  orientation?: 'horizontal' | 'vertical';

  /** The series, in the order their bars are drawn. */
  series: ChartBarSeries[];

  /**
   * The gap between the bars of a category, in pixels: between grouped bars, or between the
   * segments of a stacked bar. Defaults to 2.
   */
  spacing?: number;

  /**
   * The space between value ticks, in pixels. With it, the plot is exactly as long as its ticks
   * need along the value axis, and scrolls along it when the chart has less space. Without it, the
   * plot fills the chart.
   */
  valueTickSize?: number;

  /**
   * The values to mark on the value axis. The axis runs from the first to the last. Without them,
   * the axis runs from 0 to a round value above the highest bar.
   */
  valueTicks?: number[];
}

export const ChartBar = ({
  barSize,
  categoryTickSize,
  categoryTicks,
  className,
  data,
  formatValue,
  mode = 'grouped',
  orientation = 'vertical',
  padding,
  paddingX,
  paddingY,
  series,
  spacing = DEFAULT_SPACING,
  valueTickSize,
  valueTicks,
}: ChartBarProps): ReactElement => {
  const isHorizontal = orientation === 'horizontal';
  const isStacked = mode === 'stacked';
  const getValue = (datum: ChartBarDatum, key: string): number => datum.values[key] ?? 0;
  const ticks = valueTicks ?? getNiceTicks(data.flatMap((datum) => (
    isStacked ? (
      [series.reduce((total, { key }) => total + getValue(datum, key), 0)]
    ) : (
      series.map(({ key }) => getValue(datum, key))
    )
  )));
  const categoryAxis: ChartGraphCategoryAxis = {
    type: 'category',
    values: data.map(({ x }) => x),
    ticks: categoryTicks,
    tickSize: categoryTickSize,
  };
  const valueAxis: ChartGraphValueAxis = {
    type: 'value',
    ticks,
    formatTick: formatValue,
    tickSize: valueTickSize,
  };
  const baseline = Math.min(Math.max(0, ticks[0] ?? 0), ticks[ticks.length - 1] ?? 0);
  const renderTooltip = (x: string): ReactElement => {
    const datum = data.find((d) => d.x === x);

    /* Vertical stacked series are listed top to bottom, as they are drawn. */
    const rows = datum ? series.map(({ color, key, label }) => ({
      color,
      label,
      value: formatValue ? formatValue(getValue(datum, key)) : String(getValue(datum, key)),
    })) : [];
    return (
      <ChartGraphTooltip
        rows={isStacked && !isHorizontal ? rows.reverse() : rows}
        title={x}
      />
    );
  };

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
      }) => {
        const getValuePosition = isHorizontal ? getX : getY;
        const getCategoryPosition = isHorizontal ? getY : getX;
        const groupCount = isStacked ? 1 : series.length;
        const groupThickness = (isHorizontal ? bandY : bandX) * BAND_FILL;
        const thickness = barSize ?? Math.max(0, (groupThickness - spacing * (groupCount - 1)) / groupCount);
        const groupSize = thickness * groupCount + spacing * (groupCount - 1);

        return data.flatMap((datum) => {
          const groupStart = getCategoryPosition(datum.x) - groupSize / 2;
          const visible = series
            .map((s, index) => ({ ...s, index }))
            .filter(({ key }) => getValue(datum, key) !== 0);
          let total = baseline;
          return visible.map(({ color, index, key }, i) => {
            const value = getValue(datum, key);
            const from = isStacked ? total : baseline;
            const to = isStacked ? total + value : value;
            total = to;

            /* Stacked segments give up half the spacing at each edge they share with another. */
            const direction = Math.sign(getValuePosition(to) - getValuePosition(from));
            const startInset = isStacked && i > 0 ? spacing / 2 : 0;
            const endInset = isStacked && i < visible.length - 1 ? spacing / 2 : 0;
            const start = getValuePosition(from) + direction * startInset;
            const end = getValuePosition(to) - direction * endInset;
            const length = Math.max(0, Math.abs(end - start));
            const offset = groupStart + (isStacked ? 0 : index * (thickness + spacing));
            return (
              <rect
                className={styles.chartBarBar}
                data-dimmed={activeValue !== undefined && activeValue !== datum.x ? '' : undefined}
                fill={color}
                height={isHorizontal ? thickness : length}
                key={`${datum.x}-${key}`}
                rx={Math.min(BAR_RADIUS, thickness / 2, length / 2)}
                width={isHorizontal ? length : thickness}
                x={isHorizontal ? Math.min(start, end) : offset}
                y={isHorizontal ? offset : Math.min(start, end)}
              />
            );
          });
        });
      }}
    </ChartGraph>
  );
};

ChartBar.displayName = 'ChartBar';
