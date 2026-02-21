import {
  cloneElement,
  CSSProperties,
  forwardRef,
  ReactElement,
} from 'react';
import clsx from 'clsx';

import styles from './Badge.module.scss';

export type BadgeProps = {
  children: ReactElement;
  className?: string;
  value?: number | string | null;
  intent?: 'default' | 'danger' | 'info' | 'success' | 'warning';
};

export const Badge = forwardRef<unknown, BadgeProps>(({
  children,
  className,
  intent = 'default',
  value,
  ...props
}, ref) => cloneElement(children, {
  ...props,
  ref,
  className: clsx(children.props.className, className, styles.badge),
  style: {
    ...children.props.style,
    '--badge-value': `"${value ?? ''}"`,
  } as CSSProperties,
  'data-badge-intent': intent,
  ...(value && String(value).length > 0 && { 'data-badge-visible': true }),
}));

Badge.displayName = 'Badge';
