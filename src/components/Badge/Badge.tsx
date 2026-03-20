import {
  cloneElement,
  CSSProperties,
  forwardRef,
  ReactElement,
} from 'react';
import clsx from 'clsx';

import { ElementIntent } from '../../types';

import styles from './Badge.module.scss';

export type BadgeProps = {
  children: ReactElement;
  className?: string;
  value?: number | string | null;
  intent?: ElementIntent;
};

export const Badge = forwardRef<unknown, BadgeProps>(({
  children,
  className,
  intent = 'neutral',
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
