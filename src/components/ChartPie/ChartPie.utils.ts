import {
  ChartPieAngles,
  ChartPieCorner,
  ChartPieGroupedSlice,
  ChartPieSlice,
  ChartPieSliceGeometry,
} from './ChartPie.types';

/**
 * Folds slices whose share of the total is below a threshold into a single
 * "Other" slice, at the end. Nothing is folded unless at least two slices fall
 * below the threshold.
 *
 * @param slices - The slices
 * @param threshold - The share below which slices are folded, from 0 to 1
 * @param other - The key, label and color of the "Other" slice
 * @returns The slices, with the small ones folded
 */
export const groupSmallSlices = (
  slices: ChartPieSlice[],
  threshold: number,
  other: Omit<ChartPieSlice, 'value'>,
): ChartPieGroupedSlice[] => {
  const total = slices.reduce((sum, { value }) => sum + Math.max(0, value), 0);
  if (!total || threshold <= 0) {
    return slices;
  }
  const small = slices.filter(({ value }) => value / total < threshold);
  if (small.length < 2) {
    return slices;
  }
  return [
    ...slices.filter((slice) => !small.includes(slice)),
    {
      ...other,
      value: small.reduce((sum, { value }) => sum + value, 0), children: small,
    },
  ];
};

/**
 * Gets the angles each slice spans, in radians, clockwise from the top.
 * Negative values count as 0.
 *
 * @param values - The slices' values
 * @returns The angles, in slice order, all 0 if the total is 0
 */
export const getSliceAngles = (values: number[]): ChartPieAngles[] => {
  const total = values.reduce((sum, value) => sum + Math.max(0, value), 0);
  let angle = 0;
  return values.map((value) => {
    const start = angle;
    angle += total ? (Math.max(0, value) / total) * Math.PI * 2 : 0;
    return { start, end: angle };
  });
};

const CORNER_FIT_STEPS = 12;

/**
 * Rounds a coordinate, to keep paths short.
 */
const round = (value: number): number => Number(value.toFixed(3));

/**
 * Gets the length of the slice's edges to cut off where they meet in the
 * middle: at the point where the two edges cross for slices under half the
 * circle, or at the center for bigger ones.
 */
const getApexDistance = (span: number, halfGap: number): number => (
  span < Math.PI ? halfGap / Math.tan(span / 2) : 0
);

/**
 * Gets an SVG path for a slice of a pie, or of a donut if it has an inner
 * radius.
 *
 * Each edge of the slice runs parallel to the ray at its angle, shifted into
 * the slice by half the spacing, so neighboring slices leave a straight gap of
 * the same width all the way along. Each corner where an edge meets an arc is
 * rounded by a circle which touches both. A full pie's edges meet in a sharp
 * point near the center.
 *
 * @param geometry - The slice's geometry
 * @returns The path, or an empty path if the slice is too thin to draw
 */
export const getSlicePath = ({
  cx,
  cy,
  outerRadius: R,
  innerRadius,
  angles: { start, end },
  spacing,
  cornerRadius,
  rotation,
}: ChartPieSliceGeometry): string => {
  const span = end - start;
  const h = Math.max(0, spacing / 2);
  if (span <= 0 || R <= 0 || h >= R) {
    return '';
  }

  /* Points along an edge are given by how far they are along its ray (t) and
   * how far they are shifted into the slice (offset).
   */
  const toPoint = (radius: number, angle: number): string => (
    `${round(cx + radius * Math.sin(angle + rotation))},${round(cy - radius * Math.cos(angle + rotation))}`
  );
  const startEdgePoint = (t: number, offset: number): string => (
    toPoint(Math.hypot(t, offset), start + Math.atan2(offset, t))
  );
  const endEdgePoint = (t: number, offset: number): string => (
    toPoint(Math.hypot(t, offset), end - Math.atan2(offset, t))
  );
  const arc = (radius: number, isLarge: boolean, isClockwise: boolean, to: string): string => (
    `A${round(radius)},${round(radius)} 0 ${isLarge ? 1 : 0} ${isClockwise ? 1 : 0} ${to}`
  );

  /* A whole circle has no edges, and can't be drawn as one arc, so it is drawn
   * as two halves. */
  if (span >= Math.PI * 2 - 1e-9) {
    const circle = (radius: number, isClockwise: boolean): string => (
      `M${toPoint(radius, 0)}${arc(radius, true, isClockwise, toPoint(radius, Math.PI))}${arc(radius, true, isClockwise, toPoint(radius, 0))}Z`
    );
    return innerRadius > 0 ? circle(R, true) + circle(innerRadius, false) : circle(R, true);
  }

  if (2 * Math.asin(h / R) >= span) {
    return '';
  }

  // The inner arc only exists if the edges reach the hole before they meet:
  const apex = getApexDistance(span, h);
  const r = innerRadius > h && 2 * Math.asin(h / innerRadius) < span && Math.sqrt(innerRadius ** 2 - h ** 2) >= apex ? (
    innerRadius
  ) : (
    0
  );

  /* Finds the corner circle's center and the angle of the point where it
   * touches an arc. Outer corners sit inside the outer arc, and inner corners
   * outside the inner arc.
   */
  const getCorner = (
    radius: number,
    c: number,
    isOuter: boolean,
  ): ChartPieCorner | undefined => {
    const centerDistance = isOuter ? radius - c : radius + c;
    if (centerDistance <= h + c) {
      return undefined;
    }
    const t = Math.sqrt(centerDistance ** 2 - (h + c) ** 2);
    return { t, angle: Math.atan2(h + c, t) };
  };
  const fits = (c: number): boolean => {
    const outer = getCorner(R, c, true);
    if (!outer || 2 * outer.angle > span) {
      return false;
    }
    if (!r) {
      return outer.t >= apex;
    }
    const inner = getCorner(r, c, false);
    return !!inner && 2 * inner.angle <= span && inner.t <= outer.t;
  };

  // The corner radius shrinks until the corners fit:
  let c = Math.max(0, Math.min(cornerRadius, (R - r) / 2));
  if (c > 0 && !fits(c)) {
    let [low, high] = [0, c];
    for (let i = 0; i < CORNER_FIT_STEPS; i += 1) {
      const mid = (low + high) / 2;
      [low, high] = fits(mid) ? [mid, high] : [low, mid];
    }
    c = low;
  }

  const outer = getCorner(R, c, true) ?? {
    t: Math.sqrt(R ** 2 - h ** 2),
    angle: Math.asin(h / R),
  };
  const outerStart = start + outer.angle;
  const outerEnd = end - outer.angle;
  let path = `M${startEdgePoint(outer.t, h)}`;
  path += c ? arc(c, false, true, toPoint(R, outerStart)) : '';
  path += arc(R, outerEnd - outerStart > Math.PI, true, toPoint(R, outerEnd));
  path += c ? arc(c, false, true, endEdgePoint(outer.t, h)) : '';

  if (!r) {
    return span < Math.PI ? (
      `${path}L${endEdgePoint(apex, h)}Z`
    ) : (
      `${path}L${endEdgePoint(0, h)}L${startEdgePoint(0, h)}Z`
    );
  }

  const inner = getCorner(r, c, false) ?? {
    t: Math.sqrt(r ** 2 - h ** 2),
    angle: Math.asin(h / r),
  };
  const innerStart = start + inner.angle;
  const innerEnd = end - inner.angle;
  path += `L${endEdgePoint(inner.t, h)}`;
  path += c ? arc(c, false, true, toPoint(r, innerEnd)) : '';
  path += arc(r, innerEnd - innerStart > Math.PI, false, toPoint(r, innerStart));
  path += c ? arc(c, false, true, startEdgePoint(inner.t, h)) : '';
  return `${path}Z`;
};
