import {
  cloneElement,
  CSSProperties,
  forwardRef,
  ReactElement,
  Ref,
} from 'react';
import clsx from 'clsx';

import { ElementSize, ThemeColor } from '../../types';

import styles from './Badge.module.scss';

export type BadgePosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left';

export type BadgeProps = {
  children: ReactElement<{
    className?: string;
    ref?: Ref<Element>;
    style?: CSSProperties;
  }>;
  className?: string;
  color?: ThemeColor;
  position?: BadgePosition;
  size?: ElementSize;
  value?: number | string | null;
};

export const Badge = forwardRef<Element, BadgeProps>(({
  children,
  className,
  color = 'accent',
  position = 'top-right',
  size = 'normal',
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
  ...{
    'data-badge-position': position,
    'data-badge-size': size,
  },
  ...(value && String(value).length > 0 && { 'data-badge-visible': true }),
}));

Badge.displayName = 'Badge';
