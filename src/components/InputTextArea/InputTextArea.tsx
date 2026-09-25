import { forwardRef, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

import { ElementIntent, ElementVariant } from '../../types';
import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './InputTextArea.module.scss';

export interface InputTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  border?: boolean;
  intent?: ElementIntent;
  variant?: ElementVariant;
}

export const InputTextArea = forwardRef<HTMLTextAreaElement, InputTextAreaProps>(({
  border = true,
  className,
  intent = 'secondary',
  variant = 'ghost',
  ...props
}, ref): JSX.Element => (
  <textarea
    className={clsx(...getStyleClassNames({
      intent,
      variant,
      border,
      corners: 'normal',
    }), styles.inputTextArea, className)}
    ref={ref}
    {...props}
  />
));

InputTextArea.displayName = 'InputTextArea';
