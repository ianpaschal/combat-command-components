import {
  ElementRef,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import clsx from 'clsx';

import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './Radio.module.scss';

type RadioGroupRef = ElementRef<typeof RadioGroup>;

export type RadioValue = string | number;

export type RadioOption = {
  value: RadioValue | null;
  label?: ReactNode;
  disabled?: boolean;
};

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLDivElement>,
  'defaultValue' |
  'onChange' |
  'value'
> {
  clearable?: boolean;
  defaultValue?: RadioValue;
  disabled?: boolean;
  multiple?: false;
  onChange?: (value: RadioValue) => void;
  options: RadioOption[];
  value?: RadioValue;
}

export const Radio = forwardRef<RadioGroupRef, RadioProps>(({
  className,
  id,
  onChange,
  options,
  value,
  defaultValue,

  ...props
}, ref): JSX.Element => (
  <RadioGroup
    className={clsx(styles.radio, className)}
    ref={ref}
    aria-labelledby={id}
    value={value}
    defaultValue={defaultValue}
    onValueChange={(value) => onChange?.(value as RadioValue)}
    {...props}
  >
    {options.map(({ value: v, label }) => (
      <label className={styles.radioItem} key={v} aria-disabled={props.disabled}>
        <BaseRadio.Root
          className={clsx(getStyleClassNames({
            variant: 'ghost',
            intent: v === value ? 'accent' : 'neutral',
            border: true,
          }), styles.radioItemControl)}
          value={v}
        />
        {label}
      </label>
    ))}
  </RadioGroup>
));

Radio.displayName = 'Radio';
