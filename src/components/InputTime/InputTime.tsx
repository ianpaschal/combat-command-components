import {
  ChangeEvent,
  ReactElement,
  useState,
} from 'react';
import clsx from 'clsx';

import { InputText, InputTextProps } from '../InputText';
import {
  createFallbackTimeOfDay,
  getTimeFromInputValue,
  getTimeInputValue,
  TimeUnit,
} from './InputTime.utils';

import styles from './InputTime.module.scss';

export interface InputTimeProps extends Omit<InputTextProps,
  'defaultValue' |
  'inputMode' |
  'mask' |
  'max' |
  'min' |
  'onChange' |
  'step' |
  'type' |
  'value'
> {

  // Un-Controlled usage:

  /** The default value (a time of day). */
  defaultValue?: Date;

  // Controlled Usage:

  /** The current value (a time of day). Only the time portion is edited; the date is preserved. */
  value?: Date;

  /** Handles the value change. */
  onChange?: (value: Date) => void;

  // Configuration:

  /** The smallest unit which can be chosen. Smaller units are set to zero. */
  minUnit?: TimeUnit;
}

export const InputTime = ({
  className,
  defaultValue,
  minUnit = 'm',
  onChange,
  value,
  ...props
}: InputTimeProps): ReactElement => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value ?? internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const next = getTimeFromInputValue(current ?? createFallbackTimeOfDay(), e.target.value, minUnit);
    if (next) {
      setInternalValue(next);
      onChange?.(next);
    }
  };

  return (
    <InputText
      {...props}
      className={clsx(styles.inputTime, className)}
      step={minUnit === 's' ? 1 : 60}
      type="time"
      value={current ? getTimeInputValue(current, minUnit) : ''}
      onChange={handleChange}
    />
  );
};

InputTime.displayName = 'InputTime';
