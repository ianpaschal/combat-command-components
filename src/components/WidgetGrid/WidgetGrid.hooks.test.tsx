import {
  act,
  cleanup,
  render,
  screen,
} from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { useWidgetGrid } from './WidgetGrid.hooks';

let resize: (width: number) => void = () => {};

/**
 * Gives every element a fixed width, and replaces `ResizeObserver`, which jsdom
 * lacks, with one which reports the observed element at a new width on each
 * call to `resize`.
 *
 * @param width - The width elements start at
 */
const mockElementWidth = (width: number): void => {
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(width);
  vi.stubGlobal('ResizeObserver', class {
    private callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element): void {
      resize = (inlineSize) => {
        const entry = { target, contentBoxSize: [{ inlineSize, blockSize: 0 }] };
        this.callback([entry as unknown as ResizeObserverEntry], this as unknown as ResizeObserver);
      };
    }

    unobserve(): void {}

    disconnect(): void {}
  });
};

const GridProbe = () => {
  const { ref, columnCount } = useWidgetGrid({ columns: { 0: 1, 600: 2, 1000: 4 } });
  return <div ref={ref} data-testid="columns">{columnCount}</div>;
};

describe('useWidgetGrid', () => {
  beforeEach(() => {
    mockElementWidth(800);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('gets the column count from the measured width.', () => {
    render(<GridProbe />);
    expect(screen.getByTestId('columns').textContent).toBe('2');
  });

  it('switches column count when the grid is resized.', () => {
    render(<GridProbe />);
    act(() => resize(1200));
    expect(screen.getByTestId('columns').textContent).toBe('4');
    act(() => resize(300));
    expect(screen.getByTestId('columns').textContent).toBe('1');
  });
});
