import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from 'react';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import clsx from 'clsx';

import styles from './Collapsible.module.scss';

export interface CollapsibleProps extends Omit<ComponentPropsWithoutRef<typeof BaseCollapsible.Root>, 'children'> {
  children: ReactNode;
  trigger: ReactNode | ((state: { open: boolean }) => ReactNode);
}

export const Collapsible = forwardRef<ElementRef<typeof BaseCollapsible.Root>, CollapsibleProps>(({
  children,
  trigger,
  ...props
}, ref): JSX.Element => (
  <BaseCollapsible.Root ref={ref} {...props}>
    <BaseCollapsible.Trigger render={(triggerProps, state) => (
      <button type="button" {...triggerProps} className={clsx(styles.collapsibleTrigger, triggerProps.className)}>
        {typeof trigger === 'function' ? trigger(state) : trigger}
      </button>
    )} />
    <BaseCollapsible.Panel className={styles.collapsiblePanel}>
      {children}
    </BaseCollapsible.Panel>
  </BaseCollapsible.Root>
));

Collapsible.displayName = 'Collapsible';
