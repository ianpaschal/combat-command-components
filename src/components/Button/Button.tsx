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
import { getStyleClassNames } from '../../utils/getStyleClassNames';
import { Spinner } from '../Spinner';

import sizes from '../../style/sizes.module.scss';
import styles from './Button.module.scss';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'children'> {
  border?: boolean;
  className?: string;
  collapsePadding?: boolean;
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
  intent?: ElementIntent;
  loading?: boolean;
  rounded?: boolean;
  size?: ElementSize;
  text?: string;
  variant?: ElementVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  border = false,
  className,
  collapsePadding,
  icon,
  iconPosition,
  intent = 'neutral',
  loading = false,
  rounded,
  size = 'normal',
  text,
  type = 'button',
  variant = 'solid',
  ...props
}, ref): JSX.Element => (
  <button
    ref={ref}
    className={clsx(getStyleClassNames({
      border,
      collapsePadding,
      corners: 'normal',
      intent,
      rounded,
      size,
      square: icon && !text,
      variant,
    }), styles.button, className)}
    type={type}
    data-reverse={iconPosition === 'end'}
    {...props}
  >
    {icon && !loading && (
      <span className={sizes.icon}>{icon}</span>
    )}
    {loading && (
      <span className={sizes.icon}>
        <Spinner size={16} />
      </span>
    )}
    {text && (
      <span>{text}</span>
    )}
  </button>
));

Button.displayName = 'Button';
