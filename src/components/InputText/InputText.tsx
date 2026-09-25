import {
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
} from 'react';
import clsx from 'clsx';

import { ElementCorners } from '../../types';
import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './InputText.module.scss';

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactElement;
  loading?: boolean;
  corners?: boolean | ElementCorners;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(({
  className,
  corners = 'normal',
  icon,
  loading = false, // TODO: Implement skeleton loading state
  disabled,
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
        variant: 'ghost',
        border: true,
        size: 'normal',
      }))}
      data-has-icon={icon ?? undefined}
      disabled={loading || disabled}
      {...props}
    />
  </div>
));

InputText.displayName = 'InputText';
