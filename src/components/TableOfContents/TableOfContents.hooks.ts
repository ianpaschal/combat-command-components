import { useEffect, useState } from 'react';

const ACTIVE_BUFFER = 32;

/**
 * Finds the nearest ancestor of `el` which scrolls vertically.
 *
 * @param el - The element to start from (not itself considered).
 * @returns The scrollable ancestor, or `null` if there is none before `body`
 *   (meaning the window is the scroll container).
 */
const getScrollParent = (el: HTMLElement | null): HTMLElement | null => {
  let node = el?.parentElement ?? null;
  while (node && node !== document.body && node !== document.documentElement) {
    if (['auto', 'scroll', 'overlay'].includes(getComputedStyle(node).overflowY)) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

/**
 * Returns the ID of the last heading which has scrolled past `offset` (plus a
 * small buffer so a heading becomes active shortly before it reaches the line)
 * pixels from the top of the scroll container.
 *
 * The scroll container is the nearest scrollable ancestor of the headings, or
 * the window if there is none.
 *
 * When `offset` is omitted, the scroll container's computed
 * `scroll-padding-top` is used so the active item matches where anchor jumps
 * land. Falls back to the first ID, and to the last ID once the container is
 * scrolled to the bottom (so short trailing sections can still become active).
 *
 * @param ids - Heading element IDs in document order.
 * @param offset - Distance in pixels from the top of the scroll container.
 *   Defaults to the container's computed `scroll-padding-top`.
 * @returns The active heading ID, or `undefined` if `ids` is empty.
 */
export const useActiveHeading = (
  ids: string[],
  offset?: number,
): string | undefined => {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);

  /* Stable string so the effect re-runs on content changes, not on new array
   * identities.
   */
  const key = ids.join('|');

  useEffect(() => {
    if (!ids.length) {
      return undefined;
    }

    const container = getScrollParent(document.getElementById(ids[0]));
    const scrollTarget: HTMLElement | Window = container ?? window;
    let frame = 0;

    const update = () => {
      frame = 0;

      // Heading positions are measured relative to the container's top edge:
      const containerTop = container ? container.getBoundingClientRect().top : 0;
      const resolvedOffset = offset ?? (
        parseFloat(getComputedStyle(container ?? document.documentElement).scrollPaddingTop) || 0
      );
      const atBottom = container ? (
        container.scrollTop + container.clientHeight >= container.scrollHeight - 2
      ) : (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      );

      /* Short trailing sections may never reach the offset line, so pin the
       * last one when at the bottom.
       */
      if (atBottom) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      // Active heading is last at or above the offset line (plus buffer):
      let next = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - containerTop <= resolvedOffset + ACTIVE_BUFFER) {
          next = id;
        }
      }
      setActiveId(next);
    };

    // Throttle updates to one per animation frame:
    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      scrollTarget.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [key, offset]);

  return activeId;
};
