import {
  ElementRef,
  forwardRef,
  ReactElement,
} from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import clsx from 'clsx';

import { ElementSize } from '../../../../types';
import { sx } from '../../../../utils';
import { useTabsContext } from '../../Tabs.hooks';
import { TabTrigger } from '../TabTrigger';

import styles from './TabsList.module.scss';

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof BaseTabs.List> {
  asFooter?: boolean;
  iconOnly?: boolean;
  maxWidth?: number | string;
  size?: ElementSize;
}

export const TabsList = forwardRef<ElementRef<typeof BaseTabs.List>, TabsListProps>(({
  asFooter = false,
  className,
  iconOnly = false,
  maxWidth,
  size = 'normal',
  ...props
}, ref): ReactElement => {
  const { tabs } = useTabsContext();
  return (
    <div
      className={clsx(sx({
        variant: asFooter ? 'surface' : undefined,
        border: asFooter ? 'top' : undefined,
        elevation: asFooter ? 5 : undefined,
        corners: asFooter ? undefined : 'normal',
        size: asFooter ? 'large' : size,
      }), styles.tabsListWrapper, className)}
      data-as-footer={asFooter || undefined}
    >
      <BaseTabs.List
        ref={ref}
        className={styles.tabsList}
        data-icon-only={iconOnly || undefined}
        data-as-footer={asFooter || undefined}
        style={maxWidth ? { maxWidth } : undefined}
        {...props}
      >
        {tabs.map((tab) => (
          <TabTrigger
            key={tab.value}
            className={clsx(sx({ variant: 'ghost', corners: 'tight' }))}
            {...tab}
          />
        ))}
        <BaseTabs.Indicator className={clsx(sx({
          variant: asFooter ? undefined : 'surface',
          corners: 'tight',
          elevation: asFooter ? undefined : 1,
        }), styles.tabsListIndicator)} />
      </BaseTabs.List>
    </div>
  );
});

TabsList.displayName = 'TabsList';
