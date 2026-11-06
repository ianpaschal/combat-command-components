import { ReactElement, useId } from 'react';

import {
  ChartPlot,
  ChartPlotPaddingProps,
  ChartTooltipContent,
  getNiceTicks,
} from '../Chart';
import {
  ChartLinePoint,
  getAreaPath,
  getBandPath,
  getLinearPath,
  getSmoothPath,
} from './ChartLine.utils';

const LINE_WIDTH = 2;
const FILL_OPACITY = 0.3;
const STACKED_FILL_OPACITY = 0.5;
const ACTIVE_DOT_RADIUS = 5;

export type ChartLineSeries = {
  key: string;

  /**
   * The color of the series' line, as any CSS color.
   */
  color: string;

  /**
   * What the series shows, as the name of its row in the tooltip.
   */
  label: string;
};

export type ChartLineDatum = {
  x: string;

  /**
   * The value of each series at this x value, by series key. A missing value
   * counts as 0.
   */
  values: Record<string, number>;
};

export interface ChartLineProps extends ChartPlotPaddingProps {

  /**
   * The space each x value gets, in pixels. With it, the plot is exactly as
   * wide as its x values need, and scrolls sideways when the chart is narrower.
   * Without it, the plot fills the chart.
   */
  categoryTickSize?: number;

  /**
   * The x values to label. Without them, every x value is labelled.
   */
  categoryTicks?: string[];
  className?: string;

  /**
   * How the lines run between points. `smooth` curves through them without
   * overshooting, and `linear` draws straight segments. Defaults to `smooth`.
   */
  curve?: 'smooth' | 'linear';

  /**
   * The x values, in order along the x axis.
   */
  data: ChartLineDatum[];

  /**
   * Whether to fill the area under each line with a gradient that fades out
   * towards the bottom. Stacked lines always fill the bands between them.
   * Defaults to `true`.
   */
  fill?: boolean;

  /**
   * Formats the labels of the y axis and the values in the tooltip. Defaults to
   * `String`.
   */
  formatValue?: (value: number) => string;

  /**
   * Formats the labels of the x axis. Defaults to showing the x values as they
   * are.
   */
  formatCategory?: (x: string) => string;

  /**
   * How the series are drawn. `overlaid` draws each line from 0, over the ones
   * before it, and `stacked` draws each line on top of the ones before it,
   * which only supports values of 0 and above. Defaults to `overlaid`.
   */
  mode?: 'overlaid' | 'stacked';

  /**
   * The series, in the order they are drawn: each over the ones before it when
   * overlaid, and upwards from the baseline when stacked.
   */
  series: ChartLineSeries[];

  /**
   * The space between value ticks, in pixels. With it, the plot is exactly as
   * tall as its ticks need, and scrolls up and down when the chart is shorter.
   * Without it, the plot fills the chart.
   */
  valueTickSize?: number;

  /**
   * The values to mark on the y axis. The axis runs from the first to the last.
   * Without them, the axis runs from 0 to a round value above the highest
   * point.
   */
  valueTicks?: number[];
}

export const ChartLine = ({
  categoryTickSize,
  categoryTicks,
  className,
  curve = 'smooth',
  data,
  fill = true,
  formatValue,
  formatCategory,
  mode = 'overlaid',
  padding,
  paddingX,
  paddingY,
  series,
  valueTickSize,
  valueTicks,
}: ChartLineProps): ReactElement => {
  const gradientId = useId();
  const isStacked = mode === 'stacked';
  const getValue = (datum: ChartLineDatum, key: string): number => datum.values[key] ?? 0;

  /* The top of each series at each x value: its own value when overlaid, or the
   * running total of it and the series before it when stacked.
   */
  const tops = series.map((_, i) => data.map((datum) => (
    isStacked ? (
      series.slice(0, i + 1).reduce((total, { key }) => total + getValue(datum, key), 0)
    ) : (
      getValue(datum, series[i].key)
    )
  )));
  const ticks = valueTicks ?? getNiceTicks(tops.flat());
  const baseline = ticks[0] ?? 0;
  const getPath = (points: ChartLinePoint[]): string => (
    curve === 'smooth' ? getSmoothPath(points) : getLinearPath(points)
  );
  const getTooltip = (x: string): ChartTooltipContent => {
    const datum = data.find((d) => d.x === x);

    /* Stacked series are listed top to bottom, as they are drawn. */
    const rows = datum ? series.map(({ color, key, label }) => ({
      color,
      label,
      value: formatValue ? formatValue(getValue(datum, key)) : String(getValue(datum, key)),
    })) : [];
    return {
      rows: isStacked ? rows.reverse() : rows,
      title: formatCategory ? formatCategory(x) : x,
    };
  };

  return (
    <ChartPlot
      className={className}
      padding={padding}
      paddingX={paddingX}
      paddingY={paddingY}
      getTooltip={getTooltip}
      x={{
        type: 'category',
        values: data.map(({ x }) => x),
        formatTick: formatCategory,
        placement: 'point',
        ticks: categoryTicks,
        tickSize: categoryTickSize,
      }}
      y={{
        type: 'value',
        ticks,
        formatTick: formatValue,
        tickSize: valueTickSize,
      }}
    >
      {({ activeValue, getX, getY }) => {
        const lines = tops.map((values) => {
          const points: ChartLinePoint[] = data.map(({ x }, i) => [getX(x), getY(values[i])]);
          return { points, path: getPath(points) };
        });
        const activeIndex = data.findIndex(({ x }) => x === activeValue);
        return (
          <>
            {isStacked && lines.map(({ path }, i) => (
              <path
                d={i ? getBandPath(path, getPath([...lines[i - 1].points].reverse())) : getAreaPath(path, lines[i].points, getY(baseline))}
                fill={series[i].color}
                fillOpacity={STACKED_FILL_OPACITY}
                key={`band-${series[i].key}`}
              />
            ))}
            {!isStacked && fill && series.map(({ color, key }, i) => (
              <g key={`area-${key}`}>
                <defs>
                  <linearGradient id={`${gradientId}-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={FILL_OPACITY} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d={getAreaPath(lines[i].path, lines[i].points, getY(baseline))} fill={`url(#${gradientId}-${i})`} />
              </g>
            ))}
            {series.map(({ color, key }, i) => (
              <path
                d={lines[i].path}
                fill="none"
                key={`line-${key}`}
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={LINE_WIDTH}
              />
            ))}
            {activeIndex >= 0 && series.map(({ color, key }, i) => (
              <circle
                cx={lines[i].points[activeIndex][0]}
                cy={lines[i].points[activeIndex][1]}
                fill={color}
                key={`dot-${key}`}
                r={ACTIVE_DOT_RADIUS}
              />
            ))}
          </>
        );
      }}
    </ChartPlot>
  );
};

ChartLine.displayName = 'ChartLine';
