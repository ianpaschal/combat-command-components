import { ChartTooltipContent } from '../Chart';
import {
  ChartPieAngles,
  ChartPieBounds,
  ChartPieCorner,
  ChartPieGroupedSlice,
  ChartPieSlice,
  ChartPieSliceGeometry,
} from './ChartPie.types';

/**
 * Folds slices whose share of the total is below a threshold into a single
 * "Other" slice, at the end. Slices of 0 or below are never folded. Nothing is
 * folded unless at least two slices fall below the threshold.
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
  const small = slices.filter(({ value }) => value > 0 && value / total < threshold);
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
 * Formats a share of a total as a whole percentage.
 */
const formatShare = (share: number): string => `${Math.round(share * 100)}%`;

/**
 * Gets the content of a slice's tooltip: its value and share, or for the
 * "Other" slice, the value and share of each slice folded into it.
 *
 * @param slice - The slice
 * @param total - The total of all slices
 * @param formatValue - Formats the values
 * @returns The tooltip's title and rows
 */
export const getSliceTooltip = (
  slice: ChartPieGroupedSlice,
  total: number,
  formatValue: (value: number) => string,
): ChartTooltipContent => {
  if (!slice.children) {
    return {
      rows: [{
        color: slice.color,
        label: formatValue(slice.value),
        value: formatShare(slice.value / total),
      }],
      title: slice.label,
    };
  }
  return {
    rows: slice.children.map(({ color, label, value }) => ({
      color,
      label,
      value: `${formatValue(value)} (${formatShare(value / total)})`,
    })),
    title: `${slice.label} (${formatShare(slice.value / total)})`,
  };
};

/**
 * Gets the angles each slice spans, in radians from the origin. Negative values
 * count as 0.
 *
 * @param values - The slices' values
 * @param sweep - The share of the circle the slices fill together, from 0 to 1
 * @returns The angles, in slice order, all 0 if the total is 0
 */
export const getSliceAngles = (values: number[], sweep = 1): ChartPieAngles[] => {
  const total = values.reduce((sum, value) => sum + Math.max(0, value), 0);
  let angle = 0;
  return values.map((value) => {
    const start = angle;
    angle += total ? (Math.max(0, value) / total) * Math.PI * 2 * sweep : 0;
    return { start, end: angle };
  });
};

/**
 * Gets the bounding box of the area a pie covers, so that a pie which only
 * fills part of the circle can be sized and centered on what it covers.
 *
 * @param sweep - The share of the circle the pie covers, from 0 to 1
 * @param rotation - Where angle 0 points, in radians clockwise from the top
 * @param isCounterclockwise - Whether angles run counterclockwise
 * @param innerRatio - The radius of the hole, as a fraction of the pie's radius
 * @returns The bounds, for a radius of 1
 */
export const getSweepBounds = (
  sweep: number,
  rotation: number,
  isCounterclockwise: boolean,
  innerRatio: number,
): ChartPieBounds => {
  const span = Math.PI * 2 * Math.min(1, Math.max(0, sweep));
  const direction = isCounterclockwise ? -1 : 1;
  const toPoint = (radius: number, angle: number): [number, number] => [
    radius * Math.sin(rotation + direction * angle),
    -radius * Math.cos(rotation + direction * angle),
  ];

  /* The area reaches out to the ends of its arcs, and to the outer arc's top,
   * right, bottom and left wherever the arc passes them.
   */
  const extremes = [0, 1, 2, 3]
    .map((quarter) => {
      const angle = (direction * (quarter * Math.PI / 2 - rotation)) % (Math.PI * 2);
      return angle < 0 ? angle + Math.PI * 2 : angle;
    })
    .filter((angle) => angle <= span);
  const points = [
    toPoint(1, 0),
    toPoint(1, span),
    toPoint(innerRatio, 0),
    toPoint(innerRatio, span),
    ...extremes.map((angle) => toPoint(1, angle)),
  ];
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
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
  isCounterclockwise,
}: ChartPieSliceGeometry): string => {
  const span = end - start;
  const h = Math.max(0, spacing / 2);
  if (span <= 0 || R <= 0 || h >= R) {
    return '';
  }

  /* Points along an edge are given by how far they are along its ray (t) and
   * how far they are shifted into the slice (offset).
   */
  const direction = isCounterclockwise ? -1 : 1;
  const toPoint = (radius: number, angle: number): string => (
    `${round(cx + radius * Math.sin(rotation + direction * angle))},${round(cy - radius * Math.cos(rotation + direction * angle))}`
  );
  const startEdgePoint = (t: number, offset: number): string => (
    toPoint(Math.hypot(t, offset), start + Math.atan2(offset, t))
  );
  const endEdgePoint = (t: number, offset: number): string => (
    toPoint(Math.hypot(t, offset), end - Math.atan2(offset, t))
  );

  // Arcs are described as if the pie ran clockwise, and mirrored with it:
  const arc = (radius: number, isLarge: boolean, isClockwise: boolean, to: string): string => (
    `A${round(radius)},${round(radius)} 0 ${isLarge ? 1 : 0} ${isClockwise !== isCounterclockwise ? 1 : 0} ${to}`
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
  ): ChartPieCorner => {
    const centerDistance = isOuter ? radius - c : radius + c;
    const t = Math.sqrt(Math.max(0, centerDistance ** 2 - (h + c) ** 2));
    return { t, angle: Math.atan2(h + c, t) };
  };

  /* An outer corner circle only fits if its center is further from the center
   * than from the edge. Inner corners always fit, as the hole is wider than
   * half the gap.
   */
  const fits = (c: number): boolean => {
    if (R - c <= h + c) {
      return false;
    }
    const outer = getCorner(R, c, true);
    if (2 * outer.angle > span) {
      return false;
    }
    if (!r) {
      return outer.t >= apex;
    }
    const inner = getCorner(r, c, false);
    return 2 * inner.angle <= span && inner.t <= outer.t;
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

  const outer = getCorner(R, c, true);
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

  const inner = getCorner(r, c, false);
  const innerStart = start + inner.angle;
  const innerEnd = end - inner.angle;
  path += `L${endEdgePoint(inner.t, h)}`;
  path += c ? arc(c, false, true, toPoint(r, innerEnd)) : '';
  path += arc(r, innerEnd - innerStart > Math.PI, false, toPoint(r, innerStart));
  path += c ? arc(c, false, true, startEdgePoint(inner.t, h)) : '';
  return `${path}Z`;
};
