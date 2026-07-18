import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  ReactElement,
  Ref,
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
  align?: 'start' | 'center' | 'end';
  border?: boolean;
  className?: string;
  collapsePadding?: boolean;
  href?: string;
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
  intent?: ElementIntent;
  loading?: boolean;
  rel?: string;
  rounded?: boolean;
  size?: ElementSize;
  target?: string;
  text?: string;
  variant?: ElementVariant;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(({
  align = 'center',
  border = false,
  className,
  collapsePadding,
  href,
  icon,
  iconPosition,
  intent = 'secondary',
  loading = false,
  rel,
  rounded,
  size = 'normal',
  target,
  text,
  type = 'button',
  variant = 'solid',
  ...props
}, ref): JSX.Element => {
  const resolvedClassName = clsx(getStyleClassNames({
    border,
    collapsePadding,
    corners: 'normal',
    intent,
    rounded,
    size,
    square: icon && !text,
    variant,
  }), styles.button, className);

  const content = (
    <>
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
    </>
  );

  if (href != null) {
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        className={resolvedClassName}
        data-align={align}
        data-reverse={iconPosition === 'end'}
        href={href}
        rel={rel}
        target={target}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={resolvedClassName}
      data-align={align}
      data-reverse={iconPosition === 'end'}
      type={type}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';
