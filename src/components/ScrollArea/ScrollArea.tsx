import {
  ComponentPropsWithoutRef,
  CSSProperties,
  forwardRef,
  Ref,
} from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import clsx from 'clsx';

import { sx } from '../../utils';
import { getCssValue } from '../../utils/getCssValue';

import styles from './ScrollArea.module.scss';

type ScrollAreaProps = ComponentPropsWithoutRef<'div'> & {
  disabled?: boolean;
  focusable?: boolean;
  offset?: Partial<Record<'top' | 'bottom' | 'left' | 'right', string | number | undefined>>;

  /** A ref to the element which scrolls, to read or set its scroll position. */
  viewportRef?: Ref<HTMLDivElement>;
};

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(({
  className,
  children,
  disabled = false,
  focusable = true,
  onScroll,
  offset,
  style,
  viewportRef,
  ...props
}, ref) => (
  <BaseScrollArea.Root
    className={clsx(styles.scrollArea, className)}
    ref={ref}
    style={{
      ...style,
      '--scroll-area-offset-top': getCssValue(offset?.top),
      '--scroll-area-offset-bottom': getCssValue(offset?.bottom),
      '--scroll-area-offset-left': getCssValue(offset?.left),
      '--scroll-area-offset-right': getCssValue(offset?.right),
    } as CSSProperties}
    data-disabled={disabled || undefined}
    {...props}
  >
    <BaseScrollArea.Viewport
      className={styles.scrollAreaViewport}
      onScroll={onScroll}
      ref={viewportRef}
      {...(!focusable && { tabIndex: -1 })}
    >
      <BaseScrollArea.Content>
        {children}
      </BaseScrollArea.Content>
    </BaseScrollArea.Viewport>
    {!disabled && (
      <>
        <BaseScrollArea.Scrollbar
          className={styles.scrollAreaScrollbar}
          orientation="vertical"
        >
          <BaseScrollArea.Thumb
            className={sx({
              variant: 'shaded',
              intent: 'secondary',
            }, styles.scrollAreaThumb)}
            data-interactive
          />
        </BaseScrollArea.Scrollbar>
        <BaseScrollArea.Scrollbar
          className={styles.scrollAreaScrollbar}
          orientation="horizontal"
        >
          <BaseScrollArea.Thumb
            className={sx({
              variant: 'shaded',
              intent: 'secondary',
            }, styles.scrollAreaThumb)}
            data-interactive
          />
        </BaseScrollArea.Scrollbar>
        <BaseScrollArea.Corner />
      </>
    )}
  </BaseScrollArea.Root>
));

ScrollArea.displayName = 'ScrollArea';
