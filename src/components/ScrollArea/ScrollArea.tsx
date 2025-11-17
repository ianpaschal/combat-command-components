import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  UIEvent,
} from 'react';
import clsx from 'clsx';
import { ScrollArea as RadixScrollArea } from 'radix-ui';

import { useScrollIndicators } from './ScrollArea.hooks';
import { IndicatorConfig } from './ScrollArea.types';

import styles from './ScrollArea.module.scss';

type ScrollAreaRef = ElementRef<typeof RadixScrollArea.Root>;

type ScrollAreaProps = ComponentPropsWithoutRef<typeof RadixScrollArea.Root> & {
  indicators?: IndicatorConfig;
};

export const ScrollArea = forwardRef<ScrollAreaRef, ScrollAreaProps>(({
  className,
  children,
  indicators: indicatorConfig,
  onScroll,
  ...props
}, ref) => {
  const { ref: viewportRef, updateIndicators, indicators } = useScrollIndicators(indicatorConfig);
  const handleScroll = (e: UIEvent<HTMLDivElement>): void => {
    updateIndicators(e);
    if (onScroll) {
      onScroll(e);
    }
  };
  return (
    <RadixScrollArea.Root
      className={clsx(styles.ScrollArea_Root, className)}
      ref={ref}
      type="scroll"

      scrollHideDelay={1000}
      {...props}
    >
      <RadixScrollArea.Viewport className={styles.ScrollArea_Viewport} ref={viewportRef} onScroll={handleScroll}>
        {children}
      </RadixScrollArea.Viewport>
      {indicators}
      <RadixScrollArea.Scrollbar className={styles.ScrollArea_Scrollbar} orientation="vertical">
        <RadixScrollArea.Thumb className={styles.ScrollArea_Thumb} />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Scrollbar className={styles.ScrollArea_Scrollbar} orientation="horizontal">
        <RadixScrollArea.Thumb className={styles.ScrollArea_Thumb} />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Corner />
    </RadixScrollArea.Root>
  );
});
