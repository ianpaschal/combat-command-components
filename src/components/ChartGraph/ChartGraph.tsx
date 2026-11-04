import { CSSProperties, ReactElement } from 'react';
import clsx from 'clsx';

import { ScrollArea } from '../ScrollArea';
import { useElementSize } from './ChartGraph.hooks';

import styles from './ChartGraph.module.scss';

const MINOR_LINES_PER_TICK = 4;

export type ChartGraphAxis = {

  /**
   * The labels of the axis' ticks, in order. The y axis runs from top to bottom.
   */
  ticks: string[];

  /**
   * The space each tick gets, in pixels. With it, the graph is exactly as long as its ticks need
   * along this axis, and scrolls along it when it has less space. Without it, the graph fills the
   * space it has along this axis.
   */
  tickSize?: number;
};

export interface ChartGraphProps {
  className?: string;
  x: ChartGraphAxis;
  y: ChartGraphAxis;
}

/* The frame of a chart with an x and a y axis. The plot sits in a scroll area, and the axes stick
 * to its left and bottom edges, so that the plot scrolls under them.
 */
export const ChartGraph = ({
  className,
  x,
  y,
}: ChartGraphProps): ReactElement => {
  const [ref, { height }] = useElementSize<HTMLDivElement>();
  const [xAxisRef, xAxisSize] = useElementSize<HTMLDivElement>();
  const [yAxisRef, yAxisSize] = useElementSize<HTMLDivElement>();
  const plotWidth = x.tickSize && x.ticks.length * x.tickSize;
  const plotHeight = y.tickSize && y.ticks.length * y.tickSize;
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `auto ${plotWidth ? `${plotWidth}px` : 'minmax(0, 1fr)'}`,
    gridTemplateRows: `${plotHeight ? `${plotHeight}px` : 'minmax(0, 1fr)'} auto`,
    width: plotWidth ? 'max-content' : '100%',
    height: plotHeight ? undefined : height,
  };
  const xLines = x.ticks.length * MINOR_LINES_PER_TICK;
  const yLines = y.ticks.length * MINOR_LINES_PER_TICK;

  return (
    <div className={clsx(styles.chartGraph, className)} ref={ref}>
      <ScrollArea offset={{ bottom: xAxisSize.height, left: yAxisSize.width }}>
        <div className={styles.chartGraphGrid} style={gridStyle}>
          <div
            className={styles.chartGraphYAxis}
            ref={yAxisRef}
            style={{ gridTemplateRows: `repeat(${y.ticks.length}, 1fr)` }}
          >
            {y.ticks.map((tick, i) => (
              <span className={styles.chartGraphTick} key={`${tick}-${i}`}>{tick}</span>
            ))}
          </div>
          <div className={styles.chartGraphPlot}>
            <svg className={styles.chartGraphSvg}>
              {Array.from({ length: xLines + 1 }, (_, i) => (
                <line
                  className={i % MINOR_LINES_PER_TICK ? styles.chartGraphMinorLine : styles.chartGraphMajorLine}
                  key={`x-${i}`}
                  x1={`${(i / xLines) * 100}%`}
                  x2={`${(i / xLines) * 100}%`}
                  y1="0"
                  y2="100%"
                />
              ))}
              {Array.from({ length: yLines + 1 }, (_, i) => (
                <line
                  className={i % MINOR_LINES_PER_TICK ? styles.chartGraphMinorLine : styles.chartGraphMajorLine}
                  key={`y-${i}`}
                  x1="0"
                  x2="100%"
                  y1={`${(i / yLines) * 100}%`}
                  y2={`${(i / yLines) * 100}%`}
                />
              ))}
            </svg>
          </div>
          <div className={styles.chartGraphCorner} />
          <div
            className={styles.chartGraphXAxis}
            ref={xAxisRef}
            style={{ gridTemplateColumns: `repeat(${x.ticks.length}, 1fr)` }}
          >
            {x.ticks.map((tick, i) => (
              <span className={styles.chartGraphTick} key={`${tick}-${i}`}>{tick}</span>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

ChartGraph.displayName = 'ChartGraph';
