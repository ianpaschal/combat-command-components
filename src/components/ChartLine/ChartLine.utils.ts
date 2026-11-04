export type ChartLinePoint = [x: number, y: number];

/**
 * Gets an SVG path through points, with straight segments.
 *
 * @param points - The points, from left to right
 * @returns The path
 */
export const getLinearPath = (points: ChartLinePoint[]): string => (
  points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join('')
);

/**
 * Gets an SVG path through points, as a smooth curve which never overshoots them, so that it
 * doesn't suggest highs or lows that aren't in the data. The curve is a monotone cubic, like
 * `curveMonotoneX` in d3.
 *
 * @param points - The points, from left to right
 * @returns The path
 */
export const getSmoothPath = (points: ChartLinePoint[]): string => {
  if (points.length < 3) {
    return getLinearPath(points);
  }
  const widths = points.slice(1).map(([x], i) => x - points[i][0]);
  const slopes = points.slice(1).map(([, y], i) => (y - points[i][1]) / (widths[i] || 1));
  const tangents = points.map((_, i) => {
    if (i === 0 || i === points.length - 1) {
      return 0;
    }
    const [s0, s1] = [slopes[i - 1], slopes[i]];
    const [h0, h1] = [widths[i - 1], widths[i]];
    const p = (s0 * h1 + s1 * h0) / (h0 + h1);
    return (Math.sign(s0) + Math.sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  });
  tangents[0] = (3 * slopes[0] - tangents[1]) / 2;
  tangents[points.length - 1] = (3 * slopes[slopes.length - 1] - tangents[points.length - 2]) / 2;
  return points.reduce((path, [x, y], i) => {
    if (i === 0) {
      return `M${x},${y}`;
    }
    const [x0, y0] = points[i - 1];
    const third = widths[i - 1] / 3;
    return `${path}C${x0 + third},${y0 + tangents[i - 1] * third},${x - third},${y - tangents[i] * third},${x},${y}`;
  }, '');
};

/**
 * Closes a line's path down to a baseline, to fill the area under it.
 *
 * @param linePath - The line's path
 * @param points - The line's points, from left to right
 * @param baseline - The vertical position of the baseline
 * @returns The area's path
 */
export const getAreaPath = (linePath: string, points: ChartLinePoint[], baseline: number): string => {
  if (!points.length) {
    return '';
  }
  return `${linePath}L${points[points.length - 1][0]},${baseline}L${points[0][0]},${baseline}Z`;
};
