import {
  PointerEvent as ReactPointerEvent,
  RefObject,
  useEffect,
  useLayoutEffect,
  useReducer,
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
 * @param onScroll - Called instead of `onDismiss` when anything scrolls, if given
 */
export const useChartDismiss = (
  ref: RefObject<HTMLElement | null>,
  isEnabled: boolean,
  onDismiss: () => void,
  onScroll?: () => void,
): void => {
  const callbackRef = useRef(onDismiss);
  callbackRef.current = onDismiss;
  const scrollCallbackRef = useRef(onScroll);
  scrollCallbackRef.current = onScroll;

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    const handleDocumentPointerDown = (event: PointerEvent): void => {
      if (!ref.current?.contains(event.target as Node)) {
        callbackRef.current();
      }
    };
    const handleScroll = (): void => (scrollCallbackRef.current ?? callbackRef.current)();
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
   * Without it, the item was selected with the keyboard.
   */
  x?: number;
  y?: number;
};

export type ChartPointerHandlers = {
  onPointerLeave: (event: ReactPointerEvent<Element>) => void;
  onPointerMove: (event: ReactPointerEvent<Element>) => void;
  onPointerUp: (event: ReactPointerEvent<Element>) => void;
};

export type ChartSelection = {

  /**
   * The selected item, if any.
   */
  active?: ChartActiveItem;

  /**
   * Gets the pointer handlers for an area, such as a plot, which works out
   * which item the pointer is over.
   */
  getAreaHandlers: (getKey: (event: ReactPointerEvent<Element>) => string | undefined) => ChartPointerHandlers;

  /**
   * Gets the pointer handlers for one item, such as a slice or a segment.
   */
  getItemHandlers: (key: string) => ChartPointerHandlers;

  /**
   * Selects an item with the keyboard, or clears the selection.
   */
  select: (key: string | undefined) => void;
};

/**
 * Tracks which of a chart's items is selected: the hovered one, on touch
 * screens the tapped one, or the one picked with the keyboard. Tapping a
 * selected item again, tapping outside the chart, or scrolling clears it.
 * Scrolling keeps an item picked with the keyboard, and redraws the chart so
 * that its tooltip and marks follow it.
 *
 * @param ref - The chart's root element
 * @returns The selected item, the pointer handlers to attach to items or
 *   areas, and a way to select with the keyboard
 */
export const useChartSelection = (ref: RefObject<HTMLElement | null>): ChartSelection => {
  const [active, setActive] = useState<ChartActiveItem>();
  const [, redraw] = useReducer((count: number) => count + 1, 0);
  const isKeyboardSelection = active !== undefined && active.x === undefined;
  useChartDismiss(ref, !!active, () => setActive(undefined), isKeyboardSelection ? redraw : undefined);

  const getAreaHandlers: ChartSelection['getAreaHandlers'] = (getKey) => {
    const getActiveItem = (event: ReactPointerEvent<Element>): ChartActiveItem | undefined => {
      const key = getKey(event);
      return key === undefined ? undefined : { key, x: event.clientX, y: event.clientY };
    };
    return {
      onPointerLeave: (event) => {
        if (event.pointerType !== 'touch') {
          setActive(undefined);
        }
      },
      onPointerMove: (event) => {
        if (event.pointerType !== 'touch') {
          setActive(getActiveItem(event));
        }
      },

      /* Touch screens select by tapping, since dragging scrolls. */
      onPointerUp: (event) => {
        if (event.pointerType === 'touch') {
          const next = getActiveItem(event);
          setActive((current) => (current?.key === next?.key ? undefined : next));
        }
      },
    };
  };

  const getItemHandlers: ChartSelection['getItemHandlers'] = (key) => getAreaHandlers(() => key);

  const select: ChartSelection['select'] = (key) => setActive(key === undefined ? undefined : { key });

  return {
    active,
    getAreaHandlers,
    getItemHandlers,
    select,
  };
};
