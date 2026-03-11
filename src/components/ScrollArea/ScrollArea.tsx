import {
  ComponentPropsWithoutRef,
  CSSProperties,
  forwardRef,
} from 'react';
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import clsx from 'clsx';

import { getCssValue } from '../../utils/getCssValue';

import styles from './ScrollArea.module.scss';

type ScrollAreaProps = ComponentPropsWithoutRef<'div'> & {
  offset?: Partial<Record<'top' | 'bottom' | 'left' | 'right', string | number | undefined>>;
};

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(({
  className,
  children,
  onScroll,
  offset,
  style,
  ...props
}, ref) => (
  <BaseScrollArea.Root
    className={clsx(styles.scrollArea, className)}
    ref={ref}
    style={{
      ...style,
      '--scroll-area-offset-top': getCssValue(offset?.top),
      '--scroll-area-offset-bottom': getCssValue(offset?.bottom),
    } as CSSProperties}
    {...props}
  >
    <BaseScrollArea.Viewport className={styles.scrollAreaViewport} onScroll={onScroll}>
      <BaseScrollArea.Content>
        {children}
      </BaseScrollArea.Content>
    </BaseScrollArea.Viewport>
    <BaseScrollArea.Scrollbar className={styles.scrollAreaScrollbar} orientation="vertical">
      <BaseScrollArea.Thumb className={styles.scrollAreaThumb} />
    </BaseScrollArea.Scrollbar>
    <BaseScrollArea.Scrollbar className={styles.scrollAreaScrollbar} orientation="horizontal">
      <BaseScrollArea.Thumb className={styles.scrollAreaThumb} />
    </BaseScrollArea.Scrollbar>
    <BaseScrollArea.Corner />
  </BaseScrollArea.Root>
));
