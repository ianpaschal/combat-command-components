import { RefObject, useLayoutEffect } from 'react';

/**
 * Keeps a scroll area scrolled to its end while enabled, whenever it or its
 * content changes size. Once the viewer scrolls away from the end, it stays
 * where they left it, until they scroll back to the end.
 *
 * @param viewportRef - The element which scrolls
 * @param contentRef - The element inside it whose size sets how far it scrolls
 * @param isEnabled - Whether to keep it scrolled to the end
 * @param isVertical - Whether the end is the bottom, rather than the right
 */
export const useScrollToEnd = (
  viewportRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  isEnabled: boolean,
  isVertical: boolean,
): void => {
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!isEnabled || !viewport || !content) {
      return;
    }
    let isAtEnd = true;

    /* Scroll events arrive after the scroll, by when the content may have grown
     * again, so the position this hook set is remembered to tell its own
     * scrolls apart from the viewer's.
     */
    let ownPosition: number | undefined;
    const getPosition = (): number => (isVertical ? viewport.scrollTop : viewport.scrollLeft);
    const scrollToEnd = (): void => {
      if (!isAtEnd) {
        return;
      }
      if (isVertical) {
        viewport.scrollTop = viewport.scrollHeight;
      } else {
        viewport.scrollLeft = viewport.scrollWidth;
      }
      ownPosition = getPosition();
    };
    const handleScroll = (): void => {
      if (getPosition() === ownPosition) {
        return;
      }
      const remaining = isVertical ? (
        viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop
      ) : (
        viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft
      );
      isAtEnd = remaining < 1;
    };
    const resizeObserver = new ResizeObserver(scrollToEnd);
    resizeObserver.observe(viewport);
    resizeObserver.observe(content);
    viewport.addEventListener('scroll', handleScroll);
    scrollToEnd();
    return () => {
      resizeObserver.disconnect();
      viewport.removeEventListener('scroll', handleScroll);
    };
  }, [viewportRef, contentRef, isEnabled, isVertical]);
};
