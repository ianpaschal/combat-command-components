export type ChartPieSlice = {
  key: string;

  /**
   * The color of the slice, as any CSS color.
   */
  color: string;

  /**
   * What the slice shows, as its name in the tooltip.
   */
  label: string;

  /**
   * The slice's value. Slices are sized by their share of the total.
   */
  value: number;
};

export type ChartPieGroupedSlice = ChartPieSlice & {

  /**
   * The slices folded into this one, for the "Other" slice.
   */
  children?: ChartPieSlice[];
};

export type ChartPieAngles = {
  start: number;
  end: number;
};

export type ChartPieSliceGeometry = {
  cx: number;
  cy: number;

  /**
   * The pie's radius.
   */
  outerRadius: number;

  /**
   * The radius of the hole, or 0 for a full pie.
   */
  innerRadius: number;

  /**
   * The angles the slice spans, clockwise from the origin.
   */
  angles: ChartPieAngles;

  /**
   * The width of the gap between neighbouring slices, in pixels. Gaps have straight, parallel
   * sides.
   */
  spacing: number;

  /**
   * The radius of the slice's corners, in pixels. It shrinks to fit thin slices and narrow rings.
   */
  cornerRadius: number;

  /**
   * Where angle 0 points, in radians clockwise from the top.
   */
  rotation: number;
};

/**
 * Where a slice's rounded corner sits, measured from its start edge. The end edge mirrors it.
 */
export type ChartPieCorner = {

  /**
   * How far along the edge's ray the corner meets the edge.
   */
  t: number;

  /**
   * The angle from the edge's ray to the point where the corner meets the arc.
   */
  angle: number;
};
