export type WidgetGridColumns = number | Record<number, number>;

/**
 * Gets how many columns a grid has at a given width.
 *
 * @param columns - A fixed column count, or a map of minimum width to column count
 * @param width - The grid's width in pixels
 * @returns The column count of the widest minimum width that fits, or of the narrowest if none fit
 */
export const getColumnCount = (columns: WidgetGridColumns, width: number): number => {
  if (typeof columns === 'number') {
    return columns;
  }
  const minWidths = Object.keys(columns).map(Number).sort((a, b) => a - b);
  const minWidth = minWidths.filter((value) => value <= width).pop() ?? minWidths[0];
  return columns[minWidth];
};
