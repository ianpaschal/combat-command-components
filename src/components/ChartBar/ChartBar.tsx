import { ReactElement } from 'react';

import {
  ChartPlot,
  ChartPlotCategoryAxis,
  ChartPlotFrameProps,
  ChartPlotValueAxis,
  ChartTooltipContent,
  getNiceTicks,
} from '../Chart';
import {
  getBarExtent,
  getBarSegments,
  getBarSizes,
  getRangePath,
} from './ChartBar.utils';

import styles from './ChartBar.module.scss';

const DEFAULT_CORNER_RADIUS = 4;
const BAND_FILL = 0.6;
const DEFAULT_SPACING = 2;
const RANGE_CAP_SIZE = 8;

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

  /**
   * The color of each series' bar in this category, by series key, as any CSS
   * color. A missing color falls back to the series' color.
   */
  colors?: Record<string, string>;

  /**
   * The range each series' value is likely in, by series key, as the lowest and
   * highest values, such as a confidence interval. Each range is drawn as a
   * whisker over its bar. Ignored when stacked.
   */
  ranges?: Record<string, [number, number]>;
};

/**
 * The props of a bar chart. The props it shares with the other charts with
 * axes, such as `padding` and `xAxisPosition`, are described on
 * `ChartPlotFrameProps`. The x and y axes are the horizontal and vertical ones,
 * so in a horizontal bar chart the categories are on the y axis.
 */
export interface ChartBarProps extends ChartPlotFrameProps {

  /**
   * The thickness of each bar, in pixels. When grouped, this is the thickness
   * of each series' bar. Without it, each category's bars fill most of its
   * band.
   */
  barSize?: number;

  /**
   * The space each bar's category gets along the category axis, in pixels. With
   * it, the plot is exactly as long as its bars need, and scrolls along the
   * category axis when the chart has less space. Without it, the plot fills the
   * chart.
   */
  categoryTickSize?: number;

  /** The categories to label. Without them, every category is labelled. */
  categoryTicks?: string[];
  className?: string;

  /**
   * The radius of each bar's corners, in pixels. It shrinks to fit thin or
   * short bars. Defaults to 4.
   */
  cornerRadius?: number;

  /** The categories, in order along the category axis. */
  data: ChartBarDatum[];

  /** Formats the labels of the value axis and the values in the tooltip. */
  formatValue?: (value: number) => string;

  /**
   * How the series of a category are drawn. Stacked bars only support values of
   * 0 and above.
   */
  mode?: 'grouped' | 'stacked';

  /** Which direction the bars run. */
  orientation?: 'horizontal' | 'vertical';

  /** The series, in the order their bars are drawn. */
  series: ChartBarSeries[];

  /**
   * The gap between the bars of a category, in pixels: between grouped bars, or
   * between the segments of a stacked bar. Defaults to 2.
   */
  spacing?: number;

  /**
   * The space between value ticks, in pixels. With it, the plot is exactly as
   * long as its ticks need along the value axis, and scrolls along it when the
   * chart has less space. Without it, the plot fills the chart.
   */
  valueTickSize?: number;

  /**
   * The values to mark on the value axis. The axis runs from the first to the
   * last. Without them, the axis runs from 0 to a round value above the highest
   * bar.
   */
  valueTicks?: number[];
}

export const ChartBar = ({
  barSize,
  categoryTickSize,
  categoryTicks,
  className,
  cornerRadius = DEFAULT_CORNER_RADIUS,
  data,
  formatValue,
  mode = 'grouped',
  orientation = 'vertical',
  series,
  spacing = DEFAULT_SPACING,
  valueTickSize,
  valueTicks,
  ...frameProps
}: ChartBarProps): ReactElement => {
  const isHorizontal = orientation === 'horizontal';
  const isStacked = mode === 'stacked';
  const getValue = (datum: ChartBarDatum, key: string): number => datum.values[key] ?? 0;
  const getColor = (datum: ChartBarDatum, { color, key }: ChartBarSeries): string => (
    datum.colors?.[key] ?? color
  );
  const getRange = (datum: ChartBarDatum, key: string): [number, number] | undefined => (
    isStacked ? undefined : datum.ranges?.[key]
  );
  const ticks = valueTicks ?? getNiceTicks(data.flatMap((datum) => (
    isStacked ? (
      [series.reduce((total, { key }) => total + getValue(datum, key), 0)]
    ) : (
      series.flatMap(({ key }) => [getValue(datum, key), ...(getRange(datum, key) ?? [])])
    )
  )));
  const categoryAxis: ChartPlotCategoryAxis = {
    type: 'category',
    values: data.map(({ x }) => x),
    ticks: categoryTicks,
    tickSize: categoryTickSize,
  };
  const valueAxis: ChartPlotValueAxis = {
    type: 'value',
    ticks,
    formatTick: formatValue,
    tickSize: valueTickSize,
  };
  const baseline = Math.min(Math.max(0, ticks[0] ?? 0), ticks[ticks.length - 1] ?? 0);
  const getTooltip = (x: string): ChartTooltipContent => {
    const datum = data.find((d) => d.x === x);

    /* Vertical stacked series are listed top to bottom, as they are drawn. */
    const rows = datum ? series.map((item) => ({
      color: getColor(datum, item),
      label: item.label,
      value: formatValue ? formatValue(getValue(datum, item.key)) : String(getValue(datum, item.key)),
    })) : [];
    return { rows: isStacked && !isHorizontal ? rows.reverse() : rows, title: x };
  };

  return (
    <ChartPlot
      {...frameProps}
      className={className}
      getTooltip={getTooltip}
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
        const { thickness, groupSize } = getBarSizes(
          (isHorizontal ? bandY : bandX) * BAND_FILL,
          isStacked ? 1 : series.length,
          spacing,
          barSize,
        );

        return data.flatMap((datum) => {
          const groupStart = getCategoryPosition(datum.x) - groupSize / 2;
          const values = series.map(({ key }) => getValue(datum, key));
          const isDimmed = activeValue !== undefined && activeValue !== datum.x;
          return getBarSegments(values, baseline, isStacked, spacing).flatMap(({
            index,
            from,
            to,
            startInset,
            endInset,
          }) => {
            const { key } = series[index];
            const { position, length } = getBarExtent(
              getValuePosition(from),
              getValuePosition(to),
              startInset,
              endInset,
            );
            const offset = groupStart + (isStacked ? 0 : index * (thickness + spacing));
            const range = getRange(datum, key);
            return [
              <rect
                className={styles.chartBarBar}
                data-dimmed={isDimmed ? '' : undefined}
                fill={getColor(datum, series[index])}
                height={isHorizontal ? thickness : length}
                key={`${datum.x}-${key}`}
                rx={Math.min(cornerRadius, thickness / 2, length / 2)}
                width={isHorizontal ? length : thickness}
                x={isHorizontal ? position : offset}
                y={isHorizontal ? offset : position}
              />,
              range && (
                <path
                  className={styles.chartBarRange}
                  d={getRangePath(
                    getValuePosition(range[0]),
                    getValuePosition(range[1]),
                    offset + thickness / 2,
                    Math.min(RANGE_CAP_SIZE, thickness) / 2,
                    isHorizontal,
                  )}
                  data-dimmed={isDimmed ? '' : undefined}
                  key={`${datum.x}-${key}-range`}
                />
              ),
            ];
          });
        });
      }}
    </ChartPlot>
  );
};

ChartBar.displayName = 'ChartBar';
