import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  ReactElement,
  SyntheticEvent,
  useState,
} from 'react';
import clsx from 'clsx';

import { InputText, InputTextProps } from '../InputText';
import { parseDigits } from '../InputText/InputText.utils';
import {
  DurationUnit,
  getDigitParts,
  getDurationDigits,
  getDurationFromDigits,
  getDurationParts,
  getEffectiveMaxUnit,
  getMaxDigits,
  UNIT_MS,
} from './InputDuration.utils';

import styles from './InputDuration.module.scss';

export interface InputDurationProps extends Omit<InputTextProps,
  'defaultValue' |
  'inputMode' |
  'mask' |
  'max' |
  'min' |
  'onChange' |
  'placeholder' |
  'step' |
  'type' |
  'value'
> {

  // Un-Controlled usage:

  /** The default value (a length of time in milliseconds). */
  defaultValue?: number;

  // Controlled Usage:

  /** The current value (a length of time in milliseconds). */
  value?: number;

  /** Handles the value change (in milliseconds). */
  onChange?: (value: number) => void;

  // Configuration:

  /** The largest unit shown. It has no upper limit. */
  maxUnit: DurationUnit;

  /** The smallest unit shown, and what the last typed digit means. */
  minUnit: DurationUnit;

  /** Smallest unit step when changed with up and down arrow keys. */
  step?: number;
}

export const InputDuration = ({
  className,
  defaultValue,
  maxUnit,
  minUnit,
  onChange,
  step = 1,
  value,
  ...props
}: InputDurationProps): ReactElement => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value ?? internalValue;

  // The digits as typed, and the top unit they are read in. While typing, they are drawn as they
  // are, in the units which were shown when typing started (the top one unbounded), so nothing is
  // reformatted mid-typing (e.g. 1-7-0 is 1h 70m). Deleting a digit just drops it. On blur they are
  // cleared, and the value is drawn normalized.
  const [typed, setTyped] = useState<{ digits: string; maxUnit: DurationUnit } | null>(null);

  // When normalized, a value which reaches the next unit up (e.g. 24h) shows that unit too
  const effectiveMaxUnit = current === undefined ? maxUnit : getEffectiveMaxUnit(current, maxUnit);

  // Typing continues from what is shown, so the digits are the shown value's (in its units)
  const typing = typed !== null && current === getDurationFromDigits(typed.digits, minUnit, typed.maxUnit);
  const digits = typed !== null && typing
    ? typed.digits
    : getDurationDigits(current ?? 0, minUnit, typed?.maxUnit ?? effectiveMaxUnit);

  const commit = (next: number): void => {
    setInternalValue(next);
    onChange?.(next);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const nextMaxUnit = typed?.maxUnit ?? effectiveMaxUnit;
    const nextDigits = parseDigits(e.target.value, getMaxDigits(minUnit, nextMaxUnit));
    setTyped({ digits: nextDigits, maxUnit: nextMaxUnit });
    commit(getDurationFromDigits(nextDigits, minUnit, nextMaxUnit));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    props.onBlur?.(e);
    setTyped(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    props.onKeyDown?.(e);
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const direction = e.key === 'ArrowUp' ? 1 : -1;
      const next = Math.max((current ?? 0) + direction * step * UNIT_MS[minUnit], 0);
      setTyped(null);
      commit(next);
    }
  };

  // Digits are always added at the end, so keep the caret there
  const moveCaretToEnd = (e: SyntheticEvent<HTMLInputElement>): void => {
    const { length } = e.currentTarget.value;
    e.currentTarget.setSelectionRange(length, length);
  };

  return (
    <InputText
      {...props}
      className={clsx(styles.inputDuration, className)}
      inputMode="numeric"
      mask={() => {
        let significant = false;
        const parts = typed !== null && typing
          ? getDigitParts(digits, minUnit, typed.maxUnit)
          : getDurationParts(current ?? 0, minUnit, effectiveMaxUnit);
        return parts.map(({ unit, value: unitValue }) => (
          <span key={unit} className={styles.inputDurationUnit}>
            {`${unitValue}`.padStart(2, '0').split('').map((digit, i) => {
              significant = significant || digit !== '0';
              return (
                <span
                  key={i}
                  className={styles.inputDurationDigit}
                  data-leading-zero={!significant || undefined}
                >
                  {digit}
                </span>
              );
            })}
            <span className={styles.inputDurationLabel}>{unit}</span>
          </span>
        ));
      }}
      type="text"
      value={digits}
      onBlur={handleBlur}
      onChange={handleChange}
      onClick={moveCaretToEnd}
      onFocus={moveCaretToEnd}
      onKeyDown={handleKeyDown}
    />
  );
};

InputDuration.displayName = 'InputDuration';
