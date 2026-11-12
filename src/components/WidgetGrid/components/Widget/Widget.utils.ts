import { CSSProperties } from 'react';

export type WidgetCorner = [column: number, row: number];

export type WidgetPosition = {
  from: WidgetCorner;
  to: WidgetCorner;
};

/**
 * Converts a widget's position to CSS grid lines.
 *
 * @param position - The widget's top-left and bottom-right corners, 0-indexed, so a 1x1 widget in
 *   the top left runs from [0, 0] to [1, 1]
 * @returns The CSS grid placement. CSS grid lines are 1-indexed
 */
export const getWidgetStyle = ({ from, to }: WidgetPosition): CSSProperties => ({
  gridColumn: `${from[0] + 1} / ${to[0] + 1}`,
  gridRow: `${from[1] + 1} / ${to[1] + 1}`,
});
