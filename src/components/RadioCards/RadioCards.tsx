import {
  ElementRef,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import clsx from 'clsx';

import { Side } from '../../types';
import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './RadioCards.module.scss';

type RadioGroupRef = ElementRef<typeof RadioGroup>;

export type RadioCardsValue = string | number;

export type RadioCardOption = {
  value: RadioCardsValue | null;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export interface RadioCardsProps extends Omit<
  InputHTMLAttributes<HTMLDivElement>,
  'defaultValue' |
  'onChange' |
  'value'
> {
  border?: boolean | Side | Side[];
  defaultValue?: RadioCardsValue;
  disabled?: boolean;
  onChange?: (value: RadioCardsValue) => void;
  options: RadioCardOption[];
  value?: RadioCardsValue;
}

export const RadioCards = forwardRef<RadioGroupRef, RadioCardsProps>(({
  border,
  className,
  defaultValue,
  id,
  onChange,
  options,
  value,
  ...props
}, ref): JSX.Element => {
  const [internalValue, setInternalValue] = useState<RadioCardsValue | null>(defaultValue ?? null);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = (v: RadioCardsValue) => {
    if (!isControlled) {
      setInternalValue(v);
    }
    onChange?.(v);
  };

  return (
    <RadioGroup
      ref={ref}
      className={clsx(styles.radioCards, className)}
      aria-labelledby={id}
      value={currentValue}
      onValueChange={(v) => handleValueChange(v as RadioCardsValue)}
      {...props}
    >
      {options.map(({ value: v, label, description, disabled: optionDisabled }) => (
        <label
          key={v}
          className={clsx(
            getStyleClassNames({
              variant: v !== null && v === currentValue ? 'shaded' : 'ghost',
              intent: v !== null && v === currentValue ? 'primary' : 'secondary',
              border,
              corners: 'normal',
            }),
            styles.radioCardsItem,
          )}
          aria-disabled={props.disabled || optionDisabled}
        >
          <div className={styles.radioCardsItemContent}>
            {label && <span className={styles.radioCardsItemLabel}>{label}</span>}
            {description && <span className={styles.radioCardsItemDescription}>{description}</span>}
          </div>
          <BaseRadio.Root
            className={clsx(getStyleClassNames({
              variant: 'ghost',
              intent: 'secondary',
              border: true,
            }), styles.radioCardsItemControl)}
            value={v}
            disabled={props.disabled || optionDisabled}
          />
        </label>
      ))}
    </RadioGroup>
  );
});

RadioCards.displayName = 'RadioCards';
