import {
  PointerEvent as ReactPointerEvent,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export type ElementSize = {
  width: number;
  height: number;
};

/**
 * Tracks the size of an element's border box.
 *
 * @returns A ref to attach to the element, and its size, which is 0 until it is
 *   measured
 */
export const useElementSize = <T extends HTMLElement>(): [RefObject<T | null>, ElementSize] => {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const resizeObserver = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize[0];
      setSize({
        width: box.inlineSize,
        height: box.blockSize,
      });
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return [ref, size];
};

/**
 * Calls back when a pointer goes down outside an element, or anything scrolls,
 * while enabled. Charts use it to clear their selection when the viewer taps
 * elsewhere, and to close their tooltip, which is fixed in place and would
 * otherwise be left behind by a scroll.
 *
 * @param ref - The element
 * @param isEnabled - Whether to listen
 * @param onDismiss - The callback
 */
export const useChartDismiss = (
  ref: RefObject<HTMLElement | null>,
  isEnabled: boolean,
  onDismiss: () => void,
): void => {
  const callbackRef = useRef(onDismiss);
  callbackRef.current = onDismiss;

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    const handleDocumentPointerDown = (event: PointerEvent): void => {
      if (!ref.current?.contains(event.target as Node)) {
        callbackRef.current();
      }
    };
    const handleScroll = (): void => callbackRef.current();
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
      document.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [isEnabled, ref]);
};

export type ChartActiveItem = {
  key: string;

  /**
   * The pointer's position in the viewport, where the tooltip is shown.
   */
  x: number;
  y: number;
};

export type ChartItemHandlers = {
  onPointerLeave: (event: ReactPointerEvent<Element>) => void;
  onPointerMove: (event: ReactPointerEvent<Element>) => void;
  onPointerUp: (event: ReactPointerEvent<Element>) => void;
};

/**
 * Tracks which of a chart's items, such as slices or segments, is selected:
 * the hovered one, or on touch screens the tapped one. Tapping a selected item
 * again, tapping outside the chart, or scrolling clears it.
 *
 * @param ref - The chart's root element
 * @returns The selected item, and the pointer handlers to attach to each item
 */
export const useChartItemSelection = (ref: RefObject<HTMLElement | null>): {
  active?: ChartActiveItem;
  getItemHandlers: (key: string) => ChartItemHandlers;
} => {
  const [active, setActive] = useState<ChartActiveItem>();
  useChartDismiss(ref, !!active, () => setActive(undefined));

  const getActiveItem = (key: string, event: ReactPointerEvent<Element>): ChartActiveItem => ({
    key,
    x: event.clientX,
    y: event.clientY,
  });

  const getItemHandlers = (key: string): ChartItemHandlers => ({
    onPointerLeave: (event) => {
      if (event.pointerType !== 'touch') {
        setActive(undefined);
      }
    },
    onPointerMove: (event) => {
      if (event.pointerType !== 'touch') {
        setActive(getActiveItem(key, event));
      }
    },
    onPointerUp: (event) => {
      if (event.pointerType === 'touch') {
        const next = getActiveItem(key, event);
        setActive((current) => (current?.key === key ? undefined : next));
      }
    },
  });

  return { active, getItemHandlers };
};
