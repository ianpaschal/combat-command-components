import { useSyncExternalStore } from 'react';

export type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/**
 * `env(safe-area-inset-*)` is a CSS-only value. There's no JS API that exposes
 * it directly (e.g. it isn't reflected on `visualViewport` or any geometry
 * API). The standard workaround is to apply it to an element's style and read
 * back the resolved value via `getComputedStyle`.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/CSS/env
 */
const measureSafeAreas = (): SafeAreaInsets => {
  const probe = document.createElement('div');
  probe.style.position = 'fixed';
  probe.style.top = 'env(safe-area-inset-top, 0px)';
  probe.style.right = 'env(safe-area-inset-right, 0px)';
  probe.style.bottom = 'env(safe-area-inset-bottom, 0px)';
  probe.style.left = 'env(safe-area-inset-left, 0px)';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  document.body.appendChild(probe);

  const computed = getComputedStyle(probe);
  const insets = {
    top: parseFloat(computed.top) || 0,
    right: parseFloat(computed.right) || 0,
    bottom: parseFloat(computed.bottom) || 0,
    left: parseFloat(computed.left) || 0,
  };

  document.body.removeChild(probe);
  return insets;
};

/* Module-level external store: shared across every `useSafeCollisionPadding`
 * instance so that pages with many selects only measure once and register a
 * single `resize` listener. */
let cachedSafeAreas: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };
let initialized = false;
const listeners = new Set<() => void>();

/**
 * `useSyncExternalStore` subscribe function. Lazily performs the first
 * measurement and sets up the shared `resize` listener on the first subscriber,
 * per the recommended pattern for "Subscribing to an external store":
 * https://react.dev/reference/react/useSyncExternalStore#subscribing-to-an-external-store
 */
const subscribe = (listener: () => void): (() => void) => {
  if (!initialized) {
    initialized = true;
    cachedSafeAreas = measureSafeAreas();
    window.addEventListener('resize', () => {
      cachedSafeAreas = measureSafeAreas();
      listeners.forEach((l) => l());
    });
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/* Must return a cached/referentially-stable value when nothing has changed,
 * otherwise `useSyncExternalStore` re-renders subscribers on every call. See:
 * https://react.dev/reference/react/useSyncExternalStore#im-getting-an-error-the-result-of-getsnapshot-should-be-cached
 */
const getSnapshot = (): SafeAreaInsets => cachedSafeAreas;

/**
 * Returns a `collisionPadding`-shaped object (Base UI / Floating UI
 * `SideObject`) that adds the device's safe-area insets to a flat padding
 * value, so floating elements (e.g. `Select` popups) avoid notches, status bars
 * and home indicators on Capacitor's `viewport-fit=cover`.
 *
 * See: https://floating-ui.com/docs/detectOverflow#padding
 */
export const useSafeCollisionPadding = (padding: number = 0): SafeAreaInsets => {
  const safeAreas = useSyncExternalStore(subscribe, getSnapshot);
  return {
    top: padding + safeAreas.top,
    right: padding + safeAreas.right,
    bottom: padding + safeAreas.bottom,
    left: padding + safeAreas.left,
  };
};
