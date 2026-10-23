import {
  forwardRef,
  ReactNode,
  useId,
} from 'react';
import clsx from 'clsx';

import { InputText, InputTextProps } from '../InputText';

import styles from './InputMasked.module.scss';

export interface InputMaskedProps extends Omit<InputTextProps, 'children'> {

  /** Which side the value (and the caret) is aligned to. */
  align?: 'start' | 'end';

  /**
   * Draws something in place of the input's own text, over the input (e.g. a formatted version of
   * the value). The input's text is hidden, right-aligned, and its caret stays visible.
   *
   * @param value - The input's current value (only set for a controlled input)
   * @returns What to draw
   */
  mask: (value: string) => ReactNode;

  /**
   * Describes the masked value in words for assistive technology (e.g. "3 hours 7 minutes"), since
   * the mask itself is hidden from it and the input's own text is only the raw digits. It is
   * linked to the input with `aria-describedby`.
   */
  maskDescription?: string;
}

export const InputMasked = forwardRef<HTMLInputElement, InputMaskedProps>(({
  align = 'start',
  className,
  disabled,
  intent = 'secondary',
  loading = false,
  mask,
  maskDescription,
  style,
  variant = 'ghost',
  ...props
}, ref): JSX.Element => {
  const maskDescriptionId = useId();
  const maskColor = variant === 'surface' ? undefined : `var(--color-${variant}-${intent}-text)`;
  return (
    <InputText
      {...props}
      aria-describedby={clsx(props['aria-describedby'], maskDescription && maskDescriptionId) || undefined}
      className={clsx(styles.inputMasked, className)}
      data-align={align}
      disabled={disabled}
      intent={intent}
      loading={loading}
      ref={ref}
      style={{ ...style, caretColor: maskColor ?? 'var(--color-text-ui)' }}
      variant={variant}
    >
      {maskDescription && (
        <span className={styles.inputMaskedDescription} id={maskDescriptionId}>
          {maskDescription}
        </span>
      )}
      <div
        className={styles.inputMaskedMask}
        data-align={align}
        data-disabled={loading || disabled || undefined}
        style={{ color: maskColor }}
        aria-hidden
      >
        {mask(`${props.value ?? ''}`)}
      </div>
    </InputText>
  );
});

InputMasked.displayName = 'InputMasked';
