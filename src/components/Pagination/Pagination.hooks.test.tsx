import {
  act,
  cleanup,
  render,
} from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { usePageSlots } from './Pagination.hooks';

type ResizeCallback = (entries: [{ contentRect: { width: number } }]) => void;

let resizeCallback: ResizeCallback | undefined;
let observedElements: Element[] = [];

class MockResizeObserver implements ResizeObserver {
  constructor(callback: ResizeCallback) {
    resizeCallback = callback;
  }

  observe(target: Element): void {
    observedElements.push(target);
  }

  unobserve = vi.fn();
  disconnect = vi.fn();
}

const TestComponent = ({ initial }: { initial: number }) => {
  const { trackRef, slotRef, slotCount } = usePageSlots(initial);
  return (
    <div ref={trackRef}>
      <button ref={slotRef} type="button">slot</button>
      <span data-testid="slot-count">{slotCount}</span>
    </div>
  );
};

describe('usePageSlots', () => {
  beforeEach(() => {
    resizeCallback = undefined;
    observedElements = [];
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns the initial value before any resize is reported.', () => {
    const { getByTestId } = render(<TestComponent initial={7} />);

    expect(getByTestId('slot-count').textContent).toBe('7');
  });

  it('observes the container once mounted.', () => {
    const { container } = render(<TestComponent initial={7} />);

    expect(observedElements).toEqual([container.firstChild]);
  });

  it('updates slotCount based on the container width, button width, and gap.', () => {

    // The gap is read once when the effect is set up on mount, so the mock
    // must be in place before rendering.
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ columnGap: '8px' } as CSSStyleDeclaration);

    const { getByTestId, getByRole } = render(<TestComponent initial={1} />);

    vi.spyOn(getByRole('button'), 'getBoundingClientRect').mockReturnValue({ width: 32 } as DOMRect);

    act(() => {
      resizeCallback?.([{ contentRect: { width: 200 } }]);
    });

    // (200 + 8) / (32 + 8) = 5.2 -> 5
    expect(getByTestId('slot-count').textContent).toBe('5');
  });

  it('never reports fewer than 1 page even if nothing fits.', () => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({ columnGap: '0px' } as CSSStyleDeclaration);

    const { getByTestId, getByRole } = render(<TestComponent initial={1} />);

    vi.spyOn(getByRole('button'), 'getBoundingClientRect').mockReturnValue({ width: 100 } as DOMRect);

    act(() => {
      resizeCallback?.([{ contentRect: { width: 0 } }]);
    });

    expect(getByTestId('slot-count').textContent).toBe('1');
  });
});
