export type ChartGraphCategoryAxis = {
  type: 'category';

  /**
   * The categories, in order. A category x axis runs from left to right, and a category y axis
   * from top to bottom.
   */
  values: string[];

  /**
   * Formats the labels of the axis. Defaults to showing the categories as they are.
   */
  formatTick?: (value: string) => string;

  /**
   * Where the categories sit along the axis. `band` puts each in the middle of an equal band, as
   * for bars. `point` spreads them evenly from the start of the axis to its end, as for lines.
   * Defaults to `band`.
   */
  placement?: 'band' | 'point';

  /**
   * The categories to label. Without them, every category is labelled.
   */
  ticks?: string[];

  /**
   * The space each category gets, in pixels. With it, the plot is exactly as long as its
   * categories need along this axis, and scrolls along it when it has less space. Without it, the
   * plot fills the space it has along this axis.
   */
  tickSize?: number;
};

export type ChartGraphValueAxis = {
  type: 'value';

  /**
   * Formats the labels of the axis. Defaults to `String`.
   */
  formatTick?: (value: number) => string;

  /**
   * The values to mark with grid lines and labels. The axis runs from the first to the last. A
   * value x axis runs from left to right, and a value y axis from bottom to top.
   */
  ticks: number[];
};

export type ChartGraphAxis = ChartGraphCategoryAxis | ChartGraphValueAxis;

export type ChartGraphPlot = {

  /**
   * The category being hovered, or selected by tapping on touch screens, if any.
   */
  activeValue?: string;

  /**
   * The size of each category's band along the x axis, in pixels, or 0 for a value axis.
   */
  bandX: number;

  /**
   * The size of each category's band along the y axis, in pixels, or 0 for a value axis.
   */
  bandY: number;

  /**
   * Gets the horizontal position of an x value in the plot, in pixels. For a category, it is the
   * middle of its band.
   */
  getX: (value: string | number) => number;

  /**
   * Gets the vertical position of a y value in the plot, in pixels. For a category, it is the middle
   * of its band.
   */
  getY: (value: string | number) => number;
  height: number;
  width: number;
};

export type ChartGraphPaddingProps = {

  /**
   * The space between the edges of the plot and its outermost values on every side, in pixels.
   * Without padding, labels and marks at the edges are cut off.
   */
  padding?: number;

  /**
   * The space at the left and right of the plot, in pixels. Overrides `padding`.
   */
  paddingX?: number;

  /**
   * The space at the top and bottom of the plot, in pixels. Overrides `padding`.
   */
  paddingY?: number;
};
