import {
  CSSProperties,
  PointerEvent,
  ReactElement,
  ReactNode,
  SVGLineElementAttributes,
  UIEvent,
  useRef,
} from 'react';
import clsx from 'clsx';

import { ScrollArea } from '../../../ScrollArea';
import { Chart } from '../../Chart';
import { useElementSize } from '../../Chart.hooks';
import { ChartPlotAxis } from '../ChartPlotAxis';
import { ChartTooltipContent } from '../ChartTooltip';
import { useScrollToEnd } from './ChartPlot.hooks';
import {
  ChartPlotAxis as ChartPlotAxisConfig,
  ChartPlotAxisPadding,
  ChartPlotEdgeLabels,
  ChartPlotLayout,
  ChartPlotPaddingProps,
} from './ChartPlot.types';
import {
  getAxisBand,
  getAxisFraction,
  getAxisPosition,
  getFixedLength,
} from './ChartPlot.utils';

import styles from './ChartPlot.module.scss';

type LineProps = Pick<SVGLineElementAttributes<SVGLineElement>, 'x1' | 'x2' | 'y1' | 'y2'>;

export interface ChartPlotProps extends ChartPlotPaddingProps {

  /**
   * Draws the chart's data, as SVG, from the plot's size and positions.
   */
  children?: (plot: ChartPlotLayout) => ReactNode;
  className?: string;

  /**
   * Gets the tooltip of the hovered category, or of the tapped one on touch
   * screens. Without it, there is no tooltip.
   */
  getTooltip?: (value: string) => ChartTooltipContent;

  /**
   * How the labels at the very ends of the axes sit. `shift` moves them inward
   * so that they end at the ends of the axes, rather than being cut off.
   * `center` keeps them centered on their values like the other labels, so
   * they need padding to show in full. Defaults to `shift`.
   */
  edgeLabels?: ChartPlotEdgeLabels;

  /**
   * Whether a plot which scrolls starts scrolled to the end of its category
   * axis, such as the latest values of a time series. Defaults to `false`.
   */
  scrollToEnd?: boolean;
  x: ChartPlotAxisConfig;
  y: ChartPlotAxisConfig;
}

/* The frame of a chart with an x and a y axis. The plot and each axis sit in
 * scroll areas of their own. Only the plot's can be scrolled, and the axes'
 * follow it, so that the browser clips each of them at its own edges.
 */
export const ChartPlot = ({
  children,
  className,
  edgeLabels = 'shift',
  padding = 0,
  paddingX = padding,
  paddingY = padding,
  paddingTop = paddingY,
  paddingRight = paddingX,
  paddingBottom = paddingY,
  paddingLeft = paddingX,
  getTooltip,
  scrollToEnd = false,
  x,
  y,
}: ChartPlotProps): ReactElement => {
  const plotViewportRef = useRef<HTMLDivElement>(null);
  const xAxisViewportRef = useRef<HTMLDivElement>(null);
  const yAxisViewportRef = useRef<HTMLDivElement>(null);
  const plotContentRef = useRef<HTMLDivElement>(null);
  const [plotAreaRef, plotAreaSize] = useElementSize<HTMLDivElement>();
  const [xAxisRef, xAxisSize] = useElementSize<HTMLDivElement>();
  const [yAxisRef, yAxisSize] = useElementSize<HTMLDivElement>();
  const xPadding: ChartPlotAxisPadding = { start: paddingLeft, end: paddingRight };
  const yPadding: ChartPlotAxisPadding = { start: paddingTop, end: paddingBottom };
  const plotWidth = getFixedLength(x, xPadding);
  const plotHeight = getFixedLength(y, yPadding);
  const width = plotWidth ?? plotAreaSize.width;
  const height = plotHeight ?? plotAreaSize.height;

  /* The axes' scroll areas take no space of their own, so their tracks are
   * sized from their labels.
   */
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `${yAxisSize.width}px minmax(0, ${plotWidth ? `${plotWidth}px` : '1fr'})`,
    gridTemplateRows: `minmax(0, ${plotHeight ? `${plotHeight}px` : '1fr'}) ${xAxisSize.height}px`,
  };
  const plot: Omit<ChartPlotLayout, 'activeValue'> = {
    bandX: getAxisBand(x, width, xPadding),
    bandY: getAxisBand(y, height, yPadding),
    getX: (value) => getAxisPosition(getAxisFraction(x, value, false), width, xPadding),
    getY: (value) => getAxisPosition(getAxisFraction(y, value, true), height, yPadding),
    height,
    width,
  };

  /* Hovering and tapping pick the category nearest the pointer, along whichever
   * axis has categories.
   */
  const isCategoryY = x.type !== 'category' && y.type === 'category';
  const categoryAxis = isCategoryY ? y : x;
  const getCategoryPosition = isCategoryY ? plot.getY : plot.getX;
  useScrollToEnd(plotViewportRef, plotContentRef, scrollToEnd, isCategoryY);

  const handlePlotScroll = (event: UIEvent<HTMLDivElement>): void => {
    if (xAxisViewportRef.current) {
      xAxisViewportRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }
    if (yAxisViewportRef.current) {
      yAxisViewportRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  const getCategoryAtPointer = (event: PointerEvent<Element>): string | undefined => {
    if (categoryAxis.type !== 'category' || !categoryAxis.values.length) {
      return undefined;
    }
    const plotRect = event.currentTarget.getBoundingClientRect();
    const pointerPosition = isCategoryY ? event.clientY - plotRect.top : event.clientX - plotRect.left;
    const getDistance = (value: string): number => Math.abs(getCategoryPosition(value) - pointerPosition);
    return categoryAxis.values.reduce((nearest, candidate) => (
      getDistance(candidate) < getDistance(nearest) ? candidate : nearest
    ));
  };

  /* Points get a line through them. Bands are left to the chart, which knows
   * the size of what it draws in them.
   */
  const renderHighlight = (activeValue?: string): ReactNode => {
    if (!activeValue || categoryAxis.type !== 'category' || categoryAxis.placement !== 'point') {
      return null;
    }
    const position = getCategoryPosition(activeValue);
    const props: LineProps = isCategoryY ? {
      x1: 0, x2: plot.width, y1: position, y2: position,
    } : {
      x1: position, x2: position, y1: 0, y2: plot.height,
    };
    return (
      <line className={styles.chartPlotHighlightLine} {...props} />
    );
  };

  return (
    <Chart className={clsx(styles.chartPlot, className)} getTooltip={getTooltip}>
      {({ activeKey, getAreaHandlers }) => (
        <div className={styles.chartPlotGrid} style={gridStyle}>
          <ScrollArea
            className={styles.chartPlotYAxis}
            disabled
            focusable={false}
            viewportRef={yAxisViewportRef}
          >
            <div className={styles.chartPlotYAxisContent} style={{ height }}>
              <ChartPlotAxis
                axis={y}
                className={styles.chartPlotYAxisLabels}
                edgeLabels={edgeLabels}
                isY
                padding={yPadding}
                ref={yAxisRef}
              />
            </div>
          </ScrollArea>
          <ScrollArea
            className={styles.chartPlotPlot}
            onScroll={handlePlotScroll}
            ref={plotAreaRef}
            viewportRef={plotViewportRef}
          >
            <div
              ref={plotContentRef}
              style={{ width, height }}
              {...getAreaHandlers(getCategoryAtPointer)}
            >
              <svg className={styles.chartPlotSvg}>
                {x.type === 'value' && x.ticks.map((tick) => (
                  <line
                    className={styles.chartPlotGridLine}
                    key={`x-${tick}`}
                    x1={plot.getX(tick)}
                    x2={plot.getX(tick)}
                    y1={0}
                    y2={plot.height}
                  />
                ))}
                {y.type === 'value' && y.ticks.map((tick) => (
                  <line
                    className={styles.chartPlotGridLine}
                    key={`y-${tick}`}
                    x1={0}
                    x2={plot.width}
                    y1={plot.getY(tick)}
                    y2={plot.getY(tick)}
                  />
                ))}
                {renderHighlight(activeKey)}
                {width > 0 && height > 0 && children?.({
                  ...plot,
                  activeValue: activeKey,
                })}
              </svg>
            </div>
          </ScrollArea>
          <ScrollArea
            className={styles.chartPlotXAxis}
            disabled
            focusable={false}
            viewportRef={xAxisViewportRef}
          >
            <div style={{ width }}>
              <ChartPlotAxis
                axis={x}
                edgeLabels={edgeLabels}
                isY={false}
                padding={xPadding}
                ref={xAxisRef}
              />
            </div>
          </ScrollArea>
        </div>
      )}
    </Chart>
  );
};

ChartPlot.displayName = 'ChartPlot';
