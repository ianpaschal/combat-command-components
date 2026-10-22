import {
  cloneElement,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
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

export interface InputTextMaskProps {
  border: boolean;
  corners: boolean | ElementCorners;
  disabled?: boolean;
  icon?: ReactElement<{ className?: string }>;
  intent: ElementIntent;
  loading: boolean;
  variant: ElementVariant;
}

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  border?: boolean;
  icon?: ReactElement<{ className?: string }>;
  loading?: boolean;
  corners?: boolean | ElementCorners;
  intent?: ElementIntent;

  /**
   * Draws something in place of the input's own text, over the input (e.g. a formatted version of
   * the value). The input's text is hidden, right-aligned, and its caret stays visible.
   *
   * @param value - The input's current value (only set for a controlled input)
   * @param props - The resolved props of the input
   * @returns What to draw
   */
  mask?: (value: string, props: InputTextMaskProps) => ReactNode;
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
  mask,
  style,
  variant = 'ghost',
  ...props
}, ref): JSX.Element => {
  const maskColor = variant === 'surface' ? undefined : `var(--color-${variant}-${intent}-text)`;
  return (
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
        data-mask={mask ? true : undefined}
        disabled={loading || disabled}
        style={mask ? { ...style, caretColor: maskColor ?? 'var(--color-text-ui)' } : style}
        {...props}
      />
      {mask && (
        <div
          className={styles.inputTextMask}
          data-disabled={disabled || undefined}
          style={{ color: maskColor }}
          aria-hidden
        >
          {mask(`${props.value ?? ''}`, {
            border,
            corners,
            disabled,
            icon,
            intent,
            loading,
            variant,
          })}
        </div>
      )}
    </div>
  );
});

InputText.displayName = 'InputText';
