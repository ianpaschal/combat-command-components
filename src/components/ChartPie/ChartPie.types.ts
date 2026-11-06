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
   * The angles the slice spans, from the origin in the pie's direction.
   */
  angles: ChartPieAngles;

  /**
   * The width of the gap between neighboring slices, in pixels. Gaps have straight, parallel
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

  /**
   * Whether angles run counterclockwise from the origin, mirroring the slice.
   */
  isCounterclockwise: boolean;
};

/**
 * The bounding box of the area a pie covers, around its center, for a radius of 1.
 */
export type ChartPieBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
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
