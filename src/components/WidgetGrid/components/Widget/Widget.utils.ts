import { CSSProperties } from 'react';

export type WidgetSlot = [column: number, row: number];

export type WidgetPosition = {
  from: WidgetSlot;
  to: WidgetSlot;
};

/**
 * Converts a widget's position to CSS grid lines.
 *
 * @param position - The widget's top-left and bottom-right slots, 1-indexed and inclusive
 * @returns The CSS grid placement. Grid lines end one past the bottom-right slot
 */
export const getWidgetStyle = ({ from, to }: WidgetPosition): CSSProperties => ({
  gridColumn: `${from[0]} / ${to[0] + 1}`,
  gridRow: `${from[1]} / ${to[1] + 1}`,
});
