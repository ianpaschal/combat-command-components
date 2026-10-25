import { MouseEvent } from 'react';

/* Intercepts plain left-clicks on an anchor so a router can handle the navigation. Modified clicks
 * (new tab/window) and anchors targeting another browsing context keep the browser's default.
 */
export const handleNavigationClick = (
  e: MouseEvent<HTMLAnchorElement>,
  href: string,
  onNavigate?: (path: string) => void,
): void => {
  if (!onNavigate || e.defaultPrevented) {
    return;
  }
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return;
  }
  const { target } = e.currentTarget;
  if (target && target !== '_self') {
    return;
  }
  e.preventDefault();
  onNavigate(href);
};
