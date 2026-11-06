import {
  CSSProperties,
  PointerEvent,
  ReactElement,
  ReactNode,
  useState,
} from 'react';
import clsx from 'clsx';

import { ChartPlotAxis } from './components/ChartPlotAxis';
import { ScrollArea } from '../../../ScrollArea';
import { useChartDismiss, useElementSize } from '../../Chart.hooks';
import { ChartTooltip, ChartTooltipContent } from '../ChartTooltip';
import {
  ChartPlotAxis as ChartPlotAxisConfig,
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

type ActiveCategory = {
  value: string;

  /**
   * The pointer's position in the viewport, where the tooltip is shown.
   */
  x: number;
  y: number;
};

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
  x: ChartPlotAxisConfig;
  y: ChartPlotAxisConfig;
}

/* The frame of a chart with an x and a y axis. The plot sits in a scroll area,
 * and the axes stick to its left and bottom edges, so that the plot scrolls
 * under them.
 */
export const ChartPlot = ({
  children,
  className,
  padding = 0,
  paddingX = padding,
  paddingY = padding,
  getTooltip,
  x,
  y,
}: ChartPlotProps): ReactElement => {
  const [ref, { height }] = useElementSize<HTMLDivElement>();
  const [plotRef, plotSize] = useElementSize<HTMLDivElement>();
  const [xAxisRef, xAxisSize] = useElementSize<HTMLDivElement>();
  const [yAxisRef, yAxisSize] = useElementSize<HTMLDivElement>();
  const [lastXLabelRef, lastXLabelSize] = useElementSize<HTMLSpanElement>();
  const [active, setActive] = useState<ActiveCategory>();
  useChartDismiss(ref, !!active, () => setActive(undefined));

  const plotWidth = getFixedLength(x, paddingX);
  const plotHeight = getFixedLength(y, paddingY);

  /* Labels are centered on their values, so the labels at the top of the y axis
   * and the end of the x axis overhang the plot, unless the padding leaves room
   * for them.
   */
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `auto ${plotWidth ? `${plotWidth}px` : 'minmax(0, 1fr)'}`,
    gridTemplateRows: `${plotHeight ? `${plotHeight}px` : 'minmax(0, 1fr)'} auto`,
    width: plotWidth ? 'max-content' : '100%',
    height: plotHeight ? undefined : height,
    paddingTop: `max(0px, 0.5lh - ${paddingY}px)`,
    paddingRight: Math.max(0, lastXLabelSize.width / 2 - paddingX),
  };
  const plot: ChartPlotLayout = {
    activeValue: active?.value,
    bandX: getAxisBand(x, plotSize.width, paddingX),
    bandY: getAxisBand(y, plotSize.height, paddingY),
    getX: (value) => getAxisPosition(getAxisFraction(x, value, false), plotSize.width, paddingX),
    getY: (value) => getAxisPosition(getAxisFraction(y, value, true), plotSize.height, paddingY),
    height: plotSize.height,
    width: plotSize.width,
  };

  /* Hovering and tapping pick the category nearest the pointer, along whichever
   * axis has categories.
   */
  const isCategoryY = x.type !== 'category' && y.type === 'category';
  const categoryAxis = isCategoryY ? y : x;
  const getCategoryPosition = isCategoryY ? plot.getY : plot.getX;

  const getActiveCategory = (event: PointerEvent<HTMLDivElement>): ActiveCategory | undefined => {
    if (categoryAxis.type !== 'category' || !categoryAxis.values.length) {
      return undefined;
    }
    const plotRect = event.currentTarget.getBoundingClientRect();
    const position = isCategoryY ? event.clientY - plotRect.top : event.clientX - plotRect.left;
    const value = categoryAxis.values.reduce((nearest, candidate) => (
      Math.abs(getCategoryPosition(candidate) - position) < Math.abs(getCategoryPosition(nearest) - position) ? (
        candidate
      ) : (
        nearest
      )
    ));
    return { value, x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.pointerType !== 'touch') {
      setActive(getActiveCategory(event));
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.pointerType !== 'touch') {
      setActive(undefined);
    }
  };

  /* Touch screens select a category by tapping it, and clear it by tapping it
   * again, since dragging scrolls the plot.
   */
  const handlePointerUp = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.pointerType === 'touch') {
      const next = getActiveCategory(event);
      setActive((current) => (current?.value === next?.value ? undefined : next));
    }
  };

  /* Points get a line through them. Bands are left to the chart, which knows the
   * size of what it draws in them.
   */
  const renderHighlight = (): ReactNode => {
    if (!active || categoryAxis.type !== 'category' || categoryAxis.placement !== 'point') {
      return null;
    }
    const position = getCategoryPosition(active.value);
    return isCategoryY ? (
      <line className={styles.chartPlotHighlightLine} x1={0} x2={plot.width} y1={position} y2={position} />
    ) : (
      <line className={styles.chartPlotHighlightLine} x1={position} x2={position} y1={0} y2={plot.height} />
    );
  };

  return (
    <div className={clsx(styles.chartPlot, className)} ref={ref}>
      <ScrollArea offset={{ bottom: xAxisSize.height, left: yAxisSize.width }}>
        <div className={styles.chartPlotGrid} style={gridStyle}>
          <ChartPlotAxis
            axis={y}
            className={styles.chartPlotYAxis}
            isY
            padding={paddingY}
            ref={yAxisRef}
          />
          <div
            className={styles.chartPlotPlot}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            ref={plotRef}
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
              {renderHighlight()}
              {plotSize.width > 0 && plotSize.height > 0 && children?.(plot)}
            </svg>
          </div>
          <div className={styles.chartPlotCorner} />
          <ChartPlotAxis
            axis={x}
            className={styles.chartPlotXAxis}
            isY={false}
            lastLabelRef={lastXLabelRef}
            padding={paddingX}
            ref={xAxisRef}
          />
        </div>
      </ScrollArea>
      {active && getTooltip && (
        <ChartTooltip {...getTooltip(active.value)} x={active.x} y={active.y} />
      )}
    </div>
  );
};

ChartPlot.displayName = 'ChartPlot';
