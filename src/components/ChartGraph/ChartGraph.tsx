import {
  CSSProperties,
  PointerEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import clsx from 'clsx';

import { ChartGraphAxis } from './components/ChartGraphAxis';
import { ScrollArea } from '../ScrollArea';
import { useElementSize } from './ChartGraph.hooks';
import {
  ChartGraphAxis as ChartGraphAxisConfig,
  ChartGraphPaddingProps,
  ChartGraphPlot,
} from './ChartGraph.types';
import {
  getAxisBand,
  getAxisFraction,
  getAxisPosition,
  getCategorySteps,
} from './ChartGraph.utils';

import styles from './ChartGraph.module.scss';

const TOOLTIP_OFFSET = 12;

/**
 * Gets the fixed length of the plot along an axis, if the axis' categories have
 * a fixed size.
 *
 * @param axis - The axis
 * @param padding - The padding at each end of the axis
 * @returns The length, or nothing if the plot fills the space it has
 */
const getFixedLength = (axis: ChartGraphAxisConfig, padding: number): number | undefined => (
  axis.type === 'category' && axis.tickSize ? getCategorySteps(axis) * axis.tickSize + padding * 2 : undefined
);

type ActiveCategory = {
  value: string;
  tooltipStyle: CSSProperties;
};

export interface ChartGraphProps extends ChartGraphPaddingProps {

  /**
   * Draws the chart's data, as SVG, from the plot's size and positions.
   */
  children?: (plot: ChartGraphPlot) => ReactNode;
  className?: string;

  /**
   * Renders the tooltip of the hovered category, or of the tapped one on touch
   * screens. Without it, there is no tooltip.
   */
  renderTooltip?: (value: string) => ReactNode;
  x: ChartGraphAxisConfig;
  y: ChartGraphAxisConfig;
}

/* The frame of a chart with an x and a y axis. The plot sits in a scroll area,
 * and the axes stick to its left and bottom edges, so that the plot scrolls
 * under them.
 */
export const ChartGraph = ({
  children,
  className,
  padding = 0,
  paddingX = padding,
  paddingY = padding,
  renderTooltip,
  x,
  y,
}: ChartGraphProps): ReactElement => {
  const [ref, { height }] = useElementSize<HTMLDivElement>();
  const [plotRef, plotSize] = useElementSize<HTMLDivElement>();
  const [xAxisRef, xAxisSize] = useElementSize<HTMLDivElement>();
  const [yAxisRef, yAxisSize] = useElementSize<HTMLDivElement>();
  const [lastXLabelRef, lastXLabelSize] = useElementSize<HTMLSpanElement>();
  const [active, setActive] = useState<ActiveCategory>();
  const isActive = !!active;

  useEffect(() => {
    if (!isActive) {
      return;
    }
    const handleDocumentPointerDown = (event: globalThis.PointerEvent): void => {
      if (!ref.current?.contains(event.target as Node)) {
        setActive(undefined);
      }
    };
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    return () => document.removeEventListener('pointerdown', handleDocumentPointerDown);
  }, [isActive, ref]);

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
  const plot: ChartGraphPlot = {
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
    const rootRect = ref.current?.getBoundingClientRect();
    if (categoryAxis.type !== 'category' || !categoryAxis.values.length || !rootRect) {
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
    const left = event.clientX - rootRect.left;
    const top = event.clientY - rootRect.top;
    const shiftX = left > rootRect.width / 2 ? `calc(-100% - ${TOOLTIP_OFFSET}px)` : `${TOOLTIP_OFFSET}px`;
    const shiftY = top > rootRect.height / 2 ? `calc(-100% - ${TOOLTIP_OFFSET}px)` : `${TOOLTIP_OFFSET}px`;
    return { value, tooltipStyle: { left, top, transform: `translate(${shiftX}, ${shiftY})` } };
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
      <line className={styles.chartGraphHighlightLine} x1={0} x2={plot.width} y1={position} y2={position} />
    ) : (
      <line className={styles.chartGraphHighlightLine} x1={position} x2={position} y1={0} y2={plot.height} />
    );
  };

  return (
    <div className={clsx(styles.chartGraph, className)} ref={ref}>
      <ScrollArea offset={{ bottom: xAxisSize.height, left: yAxisSize.width }}>
        <div className={styles.chartGraphGrid} style={gridStyle}>
          <ChartGraphAxis
            axis={y}
            className={styles.chartGraphYAxis}
            isY
            padding={paddingY}
            ref={yAxisRef}
          />
          <div
            className={styles.chartGraphPlot}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            ref={plotRef}
          >
            <svg className={styles.chartGraphSvg}>
              {x.type === 'value' && x.ticks.map((tick) => (
                <line
                  className={styles.chartGraphGridLine}
                  key={`x-${tick}`}
                  x1={plot.getX(tick)}
                  x2={plot.getX(tick)}
                  y1={0}
                  y2={plot.height}
                />
              ))}
              {y.type === 'value' && y.ticks.map((tick) => (
                <line
                  className={styles.chartGraphGridLine}
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
          <div className={styles.chartGraphCorner} />
          <ChartGraphAxis
            axis={x}
            className={styles.chartGraphXAxis}
            isY={false}
            lastLabelRef={lastXLabelRef}
            padding={paddingX}
            ref={xAxisRef}
          />
        </div>
      </ScrollArea>
      {active && renderTooltip && (
        <div className={styles.chartGraphTooltip} style={active.tooltipStyle}>
          {renderTooltip(active.value)}
        </div>
      )}
    </div>
  );
};

ChartGraph.displayName = 'ChartGraph';
