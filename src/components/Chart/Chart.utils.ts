import { CSSProperties } from 'react';

const TOOLTIP_OFFSET = 12;

/**
 * Gets where to place a chart's tooltip, next to the pointer and towards the
 * middle of the viewport, so that it stays on screen.
 *
 * @param x - The pointer's horizontal position in the viewport
 * @param y - The pointer's vertical position in the viewport
 * @param viewportWidth - The viewport's width
 * @param viewportHeight - The viewport's height
 * @returns The tooltip's fixed position
 */
export const getTooltipStyle = (
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
): CSSProperties => {
  const shiftX = x > viewportWidth / 2 ? `calc(-100% - ${TOOLTIP_OFFSET}px)` : `${TOOLTIP_OFFSET}px`;
  const shiftY = y > viewportHeight / 2 ? `calc(-100% - ${TOOLTIP_OFFSET}px)` : `${TOOLTIP_OFFSET}px`;
  return { left: x, top: y, transform: `translate(${shiftX}, ${shiftY})` };
};
