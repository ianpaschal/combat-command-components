import {
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
 * @returns A ref to attach to the element, and its size, which is 0 until it is measured
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
 * Calls back when a pointer goes down outside an element, while enabled. Charts use it to clear
 * their selection when the viewer taps elsewhere.
 *
 * @param ref - The element
 * @param isEnabled - Whether to listen
 * @param onPointerDownOutside - The callback
 */
export const usePointerDownOutside = (
  ref: RefObject<HTMLElement | null>,
  isEnabled: boolean,
  onPointerDownOutside: () => void,
): void => {
  const callbackRef = useRef(onPointerDownOutside);
  callbackRef.current = onPointerDownOutside;

  useEffect(() => {
    if (!isEnabled) {
      return;
    }
    const handleDocumentPointerDown = (event: PointerEvent): void => {
      if (!ref.current?.contains(event.target as Node)) {
        callbackRef.current();
      }
    };
    document.addEventListener('pointerdown', handleDocumentPointerDown);
    return () => document.removeEventListener('pointerdown', handleDocumentPointerDown);
  }, [isEnabled, ref]);
};
