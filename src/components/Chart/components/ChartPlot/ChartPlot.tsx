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
  ChartPlotAxisSide,
  ChartPlotFrameProps,
  ChartPlotLayout,
} from './ChartPlot.types';
import {
  getAxisBand,
  getAxisFraction,
  getAxisPosition,
  getFixedLength,
} from './ChartPlot.utils';

import styles from './ChartPlot.module.scss';

type LineProps = Pick<SVGLineElementAttributes<SVGLineElement>, 'x1' | 'x2' | 'y1' | 'y2'>;

const OUTER_PADDING: Record<ChartPlotAxisSide, 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft'> = {
  top: 'paddingTop',
  right: 'paddingRight',
  bottom: 'paddingBottom',
  left: 'paddingLeft',
};

export interface ChartPlotProps extends ChartPlotFrameProps {

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
   * Draws marks for the selected category, as SVG, from the same size and
   * positions as `children`. They sit over the plot without being clipped by
   * it, so that marks on its edges show in full.
   */
  overlay?: (plot: ChartPlotLayout) => ReactNode;
  x: ChartPlotAxisConfig;
  y: ChartPlotAxisConfig;
}

/* The frame of a chart with an x and a y axis. The plot and each axis sit in
 * scroll areas of their own. Only the plot's can be scrolled, and the axes'
 * follow it, so that the browser clips each of them at its own edges.
 */
export const ChartPlot = ({
  axisPadding = 0,
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
  overlay,
  scrollToEnd = false,
  x,
  xAxisPosition = 'bottom',
  y,
  yAxisPosition = 'left',
}: ChartPlotProps): ReactElement => {
  const plotViewportRef = useRef<HTMLDivElement>(null);
  const axisViewportsRef = useRef<Partial<Record<ChartPlotAxisSide, HTMLDivElement | null>>>({});
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

  const xSides: ChartPlotAxisSide[] = xAxisPosition === 'both' ? ['top', 'bottom'] : [xAxisPosition];
  const ySides: ChartPlotAxisSide[] = yAxisPosition === 'both' ? ['left', 'right'] : [yAxisPosition];
  const getTrackSize = (side: ChartPlotAxisSide): number => {
    if (xSides.includes(side)) {
      return xAxisSize.height + axisPadding;
    }
    return ySides.includes(side) ? yAxisSize.width + axisPadding : 0;
  };

  /* The axes' scroll areas take no space of their own, so their tracks are
   * sized from their labels. Sides without an axis have empty tracks.
   */
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `${getTrackSize('left')}px minmax(0, ${plotWidth ? `${plotWidth}px` : '1fr'}) ${getTrackSize('right')}px`,
    gridTemplateRows: `${getTrackSize('top')}px minmax(0, ${plotHeight ? `${plotHeight}px` : '1fr'}) ${getTrackSize('bottom')}px`,
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
    const { scrollLeft, scrollTop } = event.currentTarget;
    xSides.forEach((side) => {
      const viewport = axisViewportsRef.current[side];
      if (viewport) {
        viewport.scrollLeft = scrollLeft;
      }
    });
    ySides.forEach((side) => {
      const viewport = axisViewportsRef.current[side];
      if (viewport) {
        viewport.scrollTop = scrollTop;
      }
    });
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

  /* The overlay sits over the plot's scroll area rather than in it, so it is
   * moved by the plot's scroll position. Scrolling clears the selection, so it
   * only needs the position from when the category was selected.
   */
  const getOverlayTransform = (): string => {
    const viewport = plotViewportRef.current;
    return `translate(${-(viewport?.scrollLeft ?? 0)} ${-(viewport?.scrollTop ?? 0)})`;
  };

  /* Only the first of a pair of axes is measured, as both have the same
   * labels.
   */
  const renderAxis = (side: ChartPlotAxisSide, index: number): ReactNode => {
    const isY = side === 'left' || side === 'right';
    const measureRef = isY ? yAxisRef : xAxisRef;
    return (
      <ScrollArea
        className={styles.chartPlotAxis}
        data-side={side}
        disabled
        focusable={false}
        key={side}
        viewportRef={(viewport) => {
          axisViewportsRef.current[side] = viewport;
        }}
      >
        <div
          className={isY ? styles.chartPlotYAxisContent : undefined}
          style={{ ...(isY ? { height } : { width }), [OUTER_PADDING[side]]: axisPadding }}
        >
          <ChartPlotAxis
            axis={isY ? y : x}
            className={isY ? styles.chartPlotYAxisLabels : undefined}
            edgeLabels={edgeLabels}
            padding={isY ? yPadding : xPadding}
            ref={index === 0 ? measureRef : undefined}
            side={side}
          />
        </div>
      </ScrollArea>
    );
  };

  return (
    <Chart className={clsx(styles.chartPlot, className)} getTooltip={getTooltip}>
      {({ activeKey, getAreaHandlers }) => (
        <div className={styles.chartPlotGrid} style={gridStyle}>
          {ySides.map(renderAxis)}
          {xSides.map(renderAxis)}
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
                {width > 0 && height > 0 && children?.({
                  ...plot,
                  activeValue: activeKey,
                })}
              </svg>
            </div>
          </ScrollArea>
          {activeKey !== undefined && (
            <svg className={styles.chartPlotOverlay}>
              <g transform={getOverlayTransform()}>
                {renderHighlight(activeKey)}
                {overlay?.({ ...plot, activeValue: activeKey })}
              </g>
            </svg>
          )}
        </div>
      )}
    </Chart>
  );
};

ChartPlot.displayName = 'ChartPlot';
