import {
  ButtonHTMLAttributes,
  forwardRef,
  ReactElement,
} from 'react';
import clsx from 'clsx';

import {
  ElementIntent,
  ElementSize,
  ElementVariant,
} from '../../types';
import { Spinner } from '../Spinner';

import styles from './Button.module.scss';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'children'> {
  className?: string;
  collapsePadding?: boolean;
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
  intent?: ElementIntent;
  loading?: boolean;
  round?: boolean;
  size?: ElementSize;
  text?: string;
  variant?: ElementVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  collapsePadding,
  icon,
  iconPosition,
  intent = 'default',
  loading = false,
  round,
  size = 'normal',
  text,
  variant = 'primary',
  ...props
}, ref): JSX.Element => (
  <button
    ref={ref}
    className={clsx(styles.Button, className)}
    data-collapse-padding={collapsePadding}
    data-intent={intent}
    data-reverse={iconPosition === 'end'}
    data-round={round}
    data-size={size}
    data-variant={variant}
    {...props}
  >
    {icon && !loading && (
      icon
    )}
    {loading && (
      <Spinner size={16} />
    )}
    {text && (
      <span>{text}</span>
    )}
  </button>
));
