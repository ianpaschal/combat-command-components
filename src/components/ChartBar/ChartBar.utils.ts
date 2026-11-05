export type ChartBarSizes = {

  /**
   * The thickness of each bar, in pixels.
   */
  thickness: number;

  /**
   * The thickness of a category's whole group of bars, including the spacing between them.
   */
  groupSize: number;
};

export type ChartBarSegment = {

  /**
   * The index of the segment's series.
   */
  index: number;

  /**
   * The value the segment starts at.
   */
  from: number;

  /**
   * The value the segment ends at.
   */
  to: number;

  /**
   * How far to pull in the segment's start, in pixels, to leave a gap before it.
   */
  startInset: number;

  /**
   * How far to pull in the segment's end, in pixels, to leave a gap after it.
   */
  endInset: number;
};

export type ChartBarExtent = {

  /**
   * Where the bar starts along the value axis, in pixels, whichever way it runs.
   */
  position: number;

  /**
   * How long the bar is along the value axis, in pixels.
   */
  length: number;
};

/**
 * Gets the thickness of each bar in a category, and of the category's whole group of bars.
 *
 * @param groupThickness - The thickness the group fills when no bar size is given
 * @param count - How many bars sit side by side in the group
 * @param spacing - The gap between neighbouring bars, in pixels
 * @param barSize - A fixed thickness for each bar, if any
 * @returns The sizes
 */
export const getBarSizes = (
  groupThickness: number,
  count: number,
  spacing: number,
  barSize?: number,
): ChartBarSizes => {
  const bars = Math.max(1, count);
  const thickness = barSize ?? Math.max(0, (groupThickness - spacing * (bars - 1)) / bars);
  return { thickness, groupSize: thickness * bars + spacing * (bars - 1) };
};

/**
 * Gets where each series' bar runs in a category. Grouped bars each run from the baseline, and
 * stacked bars run on from the end of the one before, giving up half the spacing at each edge they
 * share with another. Series with a value of 0 get no bar.
 *
 * @param values - The value of each series, in series order
 * @param baseline - The value bars start from
 * @param isStacked - Whether the bars are stacked
 * @param spacing - The gap between stacked segments, in pixels
 * @returns The segments, in series order
 */
export const getBarSegments = (
  values: number[],
  baseline: number,
  isStacked: boolean,
  spacing: number,
): ChartBarSegment[] => {
  const visible = values
    .map((value, index) => ({ value, index }))
    .filter(({ value }) => value !== 0);
  let total = baseline;
  return visible.map(({ value, index }, i) => {
    const from = isStacked ? total : baseline;
    const to = isStacked ? total + value : value;
    total = to;
    return {
      index,
      from,
      to,
      startInset: isStacked && i > 0 ? spacing / 2 : 0,
      endInset: isStacked && i < visible.length - 1 ? spacing / 2 : 0,
    };
  });
};

/**
 * Gets where a bar sits along the value axis, in pixels, after pulling in its ends.
 *
 * @param start - The position of the bar's starting value
 * @param end - The position of the bar's ending value
 * @param startInset - How far to pull in the start
 * @param endInset - How far to pull in the end
 * @returns The extent, with a length of 0 if the insets meet
 */
export const getBarExtent = (
  start: number,
  end: number,
  startInset: number,
  endInset: number,
): ChartBarExtent => {
  const length = Math.max(0, Math.abs(end - start) - startInset - endInset);
  const position = start <= end ? start + startInset : start - startInset - length;
  return { position, length };
};
