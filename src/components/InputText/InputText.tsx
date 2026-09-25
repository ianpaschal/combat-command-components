import {
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
import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './InputText.module.scss';

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  border?: boolean;
  icon?: ReactElement;
  loading?: boolean;
  corners?: boolean | ElementCorners;
  intent?: ElementIntent;
  variant?: ElementVariant;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(({
  border = true,
  className,
  corners = 'normal',
  icon,
  loading = false, // TODO: Implement skeleton loading state
  disabled,
  intent = 'secondary',
  variant = 'ghost',
  ...props
}, ref): JSX.Element => (
  <div className={clsx(styles.inputText, getStyleClassNames({
    size: 'normal',
  }), className)}>
    {icon && (
      <div className={styles.iconWrapper}>
        {icon}
      </div>
    )}
    <input
      ref={ref}
      className={clsx(getStyleClassNames({
        corners,
        intent,
        variant,
        border,
        size: 'normal',
      }))}
      data-has-icon={icon ?? undefined}
      disabled={loading || disabled}
      {...props}
    />
  </div>
));

InputText.displayName = 'InputText';
