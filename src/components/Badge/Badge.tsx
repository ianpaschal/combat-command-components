import {
  cloneElement,
  CSSProperties,
  forwardRef,
  ReactElement,
} from 'react';
import clsx from 'clsx';

import { ThemeColor } from '../../types';

import styles from './Badge.module.scss';

export type BadgeProps = {
  children: ReactElement;
  className?: string;
  color?: ThemeColor;
  value?: number | string | null;
};

export const Badge = forwardRef<unknown, BadgeProps>(({
  children,
  className,
  color = 'accent',
  value,
  ...props
}, ref) => cloneElement(children, {
  ...props,
  ref,
  className: clsx(children.props.className, className, styles.badge),
  style: {
    ...children.props.style,
    '--badge-value': `"${value ?? ''}"`,
    '--badge-color-text': `var(--color-${color}-text)`,
    '--badge-color-bg': `var(--color-${color}-bg)`,
  } as CSSProperties,
  ...(value && String(value).length > 0 && { 'data-badge-visible': true }),
}));

Badge.displayName = 'Badge';
