import {
  cloneElement,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
} from 'react';
import clsx from 'clsx';

import {
  ElementCorners,
  ElementIntent,
  ElementVariant,
} from '../../types';
import { sx } from '../../utils';

import sizes from '../../style/sizes.module.scss';
import styles from './InputText.module.scss';

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  border?: boolean;
  icon?: ReactElement<{ className?: string }>;
  loading?: boolean;
  corners?: boolean | ElementCorners;
  intent?: ElementIntent;
  variant?: ElementVariant;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(({
  border = true,
  children,
  className,
  corners = 'normal',
  icon,
  loading = false, // TODO: Implement skeleton loading state
  disabled,
  intent = 'secondary',
  variant = 'ghost',
  ...props
}, ref): ReactElement => (
  <div className={sx({ size: 'normal' }, styles.inputText, className)} data-has-icon={icon || undefined}>
    {icon && (
      <div className={styles.inputTextIconWrapper}>
        {cloneElement(icon, {
          className: clsx(sizes.icon, icon.props.className),
        })}
      </div>
    )}
    <input
      ref={ref}
      className={sx({
        corners,
        intent,
        variant,
        border,
      })}
      disabled={loading || disabled}
      {...props}
    />
    {children}
  </div>
));

InputText.displayName = 'InputText';
