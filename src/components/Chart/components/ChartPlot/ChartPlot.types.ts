export type ChartPlotCategoryAxis = {
  type: 'category';

  /**
   * The categories, in order. A category x axis runs from left to right, and a
   * category y axis from top to bottom.
   */
  values: string[];

  /**
   * Formats the labels of the axis. Defaults to showing the categories as they
   * are.
   */
  formatTick?: (value: string) => string;

  /**
   * Where the categories sit along the axis. `band` puts each in the middle of
   * an equal band, as for bars. `point` spreads them evenly from the start of
   * the axis to its end, as for lines. Defaults to `band`.
   */
  placement?: 'band' | 'point';

  /**
   * The categories to label. Without them, every category is labelled.
   */
  ticks?: string[];

  /**
   * The space each category gets, in pixels. With it, the plot is exactly as
   * long as its categories need along this axis, and scrolls along it when it
   * has less space. Without it, the plot fills the space it has along this
   * axis.
   */
  tickSize?: number;
};

export type ChartPlotValueAxis = {
  type: 'value';

  /**
   * Formats the labels of the axis. Defaults to `String`.
   */
  formatTick?: (value: number) => string;

  /**
   * The values to mark with grid lines and labels. The axis runs from the first
   * to the last. A value x axis runs from left to right, and a value y axis
   * from bottom to top.
   */
  ticks: number[];

  /**
   * The space between ticks, in pixels. With it, the plot is exactly as long as
   * its ticks need along this axis, and scrolls along it when it has less
   * space. Without it, the plot fills the space it has along this axis.
   */
  tickSize?: number;
};

export type ChartPlotAxis = ChartPlotCategoryAxis | ChartPlotValueAxis;

export type ChartPlotLayout = {

  /**
   * The category being hovered, or selected by tapping on touch screens, if
   * any.
   */
  activeValue?: string;

  /**
   * The size of each category's band along the x axis, in pixels, or 0 for a
   * value axis.
   */
  bandX: number;

  /**
   * The size of each category's band along the y axis, in pixels, or 0 for a
   * value axis.
   */
  bandY: number;

  /**
   * Gets the horizontal position of an x value in the plot, in pixels. For a
   * category, it is the middle of its band.
   */
  getX: (value: string | number) => number;

  /**
   * Gets the vertical position of a y value in the plot, in pixels. For a
   * category, it is the middle of its band.
   */
  getY: (value: string | number) => number;
  height: number;
  width: number;
};

export type ChartPlotPaddingProps = {

  /**
   * The empty space inside the plot on every side, in pixels, between its edges
   * and its outermost values. The axes' labels move with the values, so the
   * padding moves them in from the plot's edges too. Defaults to 0.
   */
  padding?: number;

  /**
   * The space at the left and right of the plot, in pixels. Overrides
   * `padding`.
   */
  paddingX?: number;

  /**
   * The space at the top and bottom of the plot, in pixels. Overrides
   * `padding`.
   */
  paddingY?: number;

  /** The space at the top of the plot, in pixels. Overrides `paddingY`. */
  paddingTop?: number;

  /** The space at the right of the plot, in pixels. Overrides `paddingX`. */
  paddingRight?: number;

  /** The space at the bottom of the plot, in pixels. Overrides `paddingY`. */
  paddingBottom?: number;

  /** The space at the left of the plot, in pixels. Overrides `paddingX`. */
  paddingLeft?: number;
};

export type ChartPlotEdgeLabels = 'shift' | 'center';

export type ChartPlotXAxisPosition = 'top' | 'bottom' | 'both';

export type ChartPlotYAxisPosition = 'left' | 'right' | 'both';

export type ChartPlotAxisSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * The props of a plot's frame which every chart with axes passes on.
 */
export type ChartPlotFrameProps = ChartPlotPaddingProps & {

  /**
   * The space on the outer side of each axis, in pixels, such as to the left of
   * a y axis on the left. It is inside the axes' scroll areas, so their edges
   * and shadows still reach the edges of the chart. Defaults to 0.
   */
  axisPadding?: number;

  /**
   * The chart's accessible name, such as its title, for the plot and its data
   * table. Screen readers announce it when the plot is focused.
   */
  label?: string;

  /**
   * How the labels at the very ends of the axes sit. `shift` moves them inward,
   * so that they end at the ends of the axes rather than being cut off.
   * `center` keeps them centered on their values like the other labels, so
   * they need padding to show in full. Labels centered in bands are never at
   * the very ends. Defaults to `shift`.
   */
  edgeLabels?: ChartPlotEdgeLabels;

  /**
   * Whether a plot which scrolls starts scrolled to the end of its category
   * axis, such as the latest values of a time series, and stays there as it
   * grows until the viewer scrolls away. Defaults to `false`.
   */
  scrollToEnd?: boolean;

  /**
   * Where the x axis sits: above the plot, below it, or on both sides. The x
   * axis is the horizontal one, whether it shows categories or values.
   * Defaults to `bottom`.
   */
  xAxisPosition?: ChartPlotXAxisPosition;

  /**
   * Where the y axis sits: left of the plot, right of it, or on both sides. The
   * y axis is the vertical one, whether it shows categories or values. Defaults
   * to `left`.
   */
  yAxisPosition?: ChartPlotYAxisPosition;
};

export type ChartPlotAxisPadding = {

  /** The padding at the start of the axis: the left of an x axis, or the top of a y axis. */
  start: number;

  /** The padding at the end of the axis: the right of an x axis, or the bottom of a y axis. */
  end: number;
};
