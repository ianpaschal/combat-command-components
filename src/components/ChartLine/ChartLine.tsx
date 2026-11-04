import { ReactElement, useId } from 'react';

import {
  ChartGraph,
  ChartGraphPaddingProps,
  ChartGraphTooltip,
} from '../ChartGraph';
import { getNiceTicks } from '../ChartGraph/ChartGraph.utils';
import {
  ChartLinePoint,
  getAreaPath,
  getLinearPath,
  getSmoothPath,
} from './ChartLine.utils';

const LINE_WIDTH = 2;
const FILL_OPACITY = 0.3;
const ACTIVE_DOT_RADIUS = 4;

export type ChartLineDatum = {
  x: string;
  value: number;
};

export interface ChartLineProps extends ChartGraphPaddingProps {
  className?: string;

  /**
   * The color of the line, as any CSS color.
   */
  color: string;

  /**
   * How the line runs between points. `smooth` curves through them without overshooting, and
   * `linear` draws straight segments. Defaults to `smooth`.
   */
  curve?: 'smooth' | 'linear';

  /**
   * The points of the line, in order along the x axis.
   */
  data: ChartLineDatum[];

  /**
   * Whether to fill the area under the line with a gradient that fades out towards the bottom.
   * Defaults to `true`.
   */
  fill?: boolean;

  /**
   * Formats the labels of the y axis. Defaults to `String`.
   */
  formatValue?: (value: number) => string;

  /**
   * Formats the labels of the x axis. Defaults to showing the x values as they are.
   */
  formatXTick?: (x: string) => string;

  /**
   * What the line shows, as the name of its row in the tooltip.
   */
  label: string;

  /**
   * The space each x value gets, in pixels. With it, the plot is exactly as wide as its x values
   * need, and scrolls sideways when the chart is narrower. Without it, the plot fills the chart.
   */
  tickSizeX?: number;

  /**
   * The x values to label. Without them, every x value is labelled.
   */
  xTicks?: string[];

  /**
   * The values to mark on the y axis. The axis runs from the first to the last. Without them, the
   * axis runs from 0 to a round value above the highest point.
   */
  yTicks?: number[];
}

export const ChartLine = ({
  className,
  color,
  curve = 'smooth',
  data,
  fill = true,
  formatValue,
  formatXTick,
  label,
  padding,
  paddingX,
  paddingY,
  tickSizeX,
  xTicks,
  yTicks = getNiceTicks(data.map(({ value }) => value)),
}: ChartLineProps): ReactElement => {
  const gradientId = useId();
  const renderTooltip = (x: string): ReactElement => (
    <ChartGraphTooltip
      rows={data.filter((datum) => datum.x === x).map(({ value }) => ({
        color,
        label,
        value: formatValue ? formatValue(value) : String(value),
      }))}
      title={formatXTick ? formatXTick(x) : x}
    />
  );

  return (
    <ChartGraph
      className={className}
      padding={padding}
      paddingX={paddingX}
      paddingY={paddingY}
      renderTooltip={renderTooltip}
      x={{
        type: 'category',
        values: data.map(({ x }) => x),
        formatTick: formatXTick,
        placement: 'point',
        ticks: xTicks,
        tickSize: tickSizeX,
      }}
      y={{ type: 'value', ticks: yTicks, formatTick: formatValue }}
    >
      {({ activeValue, getX, getY }) => {
        const points: ChartLinePoint[] = data.map(({ x, value }) => [getX(x), getY(value)]);
        const linePath = curve === 'smooth' ? getSmoothPath(points) : getLinearPath(points);
        const activeDatum = data.find(({ x }) => x === activeValue);
        return (
          <>
            {fill && (
              <>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={FILL_OPACITY} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d={getAreaPath(linePath, points, getY(yTicks[0] ?? 0))} fill={`url(#${gradientId})`} />
              </>
            )}
            <path
              d={linePath}
              fill="none"
              stroke={color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={LINE_WIDTH}
            />
            {activeDatum && (
              <circle
                cx={getX(activeDatum.x)}
                cy={getY(activeDatum.value)}
                fill={color}
                r={ACTIVE_DOT_RADIUS}
                stroke="var(--color-text-header)"
                strokeWidth={LINE_WIDTH}
              />
            )}
          </>
        );
      }}
    </ChartGraph>
  );
};

ChartLine.displayName = 'ChartLine';
