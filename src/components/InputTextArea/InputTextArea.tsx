import { forwardRef, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './InputTextArea.module.scss';

export type InputTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const InputTextArea = forwardRef<HTMLTextAreaElement, InputTextAreaProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <textarea
    className={clsx(...getStyleClassNames({
      variant: 'ghost',
      border: true,
      corners: 'normal',
    }), styles.inputTextArea, className)}
    ref={ref}
    {...props}
  />
));

InputTextArea.displayName = 'InputTextArea';
