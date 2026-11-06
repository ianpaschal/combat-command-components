import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * Replaces `ResizeObserver`, which jsdom lacks, with one which reports every
 * observed element at a fixed size as soon as it is observed.
 *
 * @param width - The width to report
 * @param height - The height to report
 */
export const mockElementSize = (width: number, height: number): void => {
  vi.stubGlobal('ResizeObserver', class {
    private callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element): void {
      const entry = { target, borderBoxSize: [{ inlineSize: width, blockSize: height }] };
      this.callback([entry as unknown as ResizeObserverEntry], this as unknown as ResizeObserver);
    }

    unobserve(): void {}

    disconnect(): void {}
  });
};

/**
 * Moves a mouse over an element.
 */
export const hover = (element: Element, clientX = 0, clientY = 0): void => {
  fireEvent.pointerMove(element, { pointerType: 'mouse', clientX, clientY });
};

/**
 * Moves a mouse off an element.
 */
export const unhover = (element: Element): void => {
  fireEvent.pointerLeave(element, { pointerType: 'mouse' });
};

/**
 * Taps an element on a touch screen.
 */
export const tap = (element: Element, clientX = 0, clientY = 0): void => {
  fireEvent.pointerUp(element, { pointerType: 'touch', clientX, clientY });
};

/**
 * Gets the chart tooltip shown in its portal on the document's body, if any.
 * Tests hash CSS module class names, so it is found by the name's stem.
 */
export const getTooltip = (): HTMLElement | null => (
  document.body.querySelector(':scope > [class*="chartTooltipPortal"]')
);
