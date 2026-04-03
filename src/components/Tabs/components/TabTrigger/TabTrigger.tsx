import {
  ElementRef,
  forwardRef,
  ReactElement,
  ReactNode,
} from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import clsx from 'clsx';

import { sx } from '../../../../utils';

import sizes from '../../../../style/sizes.module.scss';
import styles from './TabTrigger.module.scss';

export interface TabTriggerProps extends Omit<React.ComponentPropsWithoutRef<typeof BaseTabs.Tab>, 'content'> {
  content: ReactNode;
  icon?: ReactElement;
  title?: string;
}

export const TabTrigger = forwardRef<ElementRef<typeof BaseTabs.Tab>, TabTriggerProps>(({
  className,
  content: _,
  icon,
  title,
  ...props
}, ref): ReactElement => (
  <BaseTabs.Tab
    ref={ref}
    className={clsx(sx({ variant: 'ghost', corners: 'tight' }), styles.tab, className)}
    {...props}
  >
    {icon && (
      <span className={sizes.icon}>{icon}</span>
    )}
    {title && (
      <span className={styles.tabText}>{title}</span>
    )}
  </BaseTabs.Tab>
));

TabTrigger.displayName = 'TabTrigger';
