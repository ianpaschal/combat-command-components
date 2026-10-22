import {
  Fragment,
  HTMLAttributes,
  ReactElement,
  useState,
} from 'react';
import clsx from 'clsx';

import { ElementIntent, ElementVariant } from '../../types';
import { DEFAULT_MINUTE_STEP, DEFAULT_SECOND_STEP } from '../InputDateTime/InputDateTime.utils';
import { Select, SelectValue } from '../Select';
import {
  createFallbackTimeOfDay,
  getTimeOfDayParts,
  getTimeOptions,
  getVisibleTimeUnits,
  normalizeTimeOfDay,
  setTimeOfDay,
  TimeUnit,
} from './InputTime.utils';

import styles from './InputTime.module.scss';

const UNIT_PARTS = {
  h: 'hours',
  m: 'minutes',
  s: 'seconds',
} as const;

export interface InputTimeProps extends Omit<HTMLAttributes<HTMLDivElement>,
  'defaultValue' |
  'onChange'
> {
  border?: boolean;
  className?: string;
  disabled?: boolean;
  intent?: ElementIntent;
  variant?: ElementVariant;

  // Un-Controlled usage:

  /** The default value (a time of day). */
  defaultValue?: Date;

  // Controlled Usage:

  /** The current value (a time of day). Only the time portion is edited; the date is preserved. */
  value?: Date;

  /** Handles the value change. */
  onChange?: (value: Date) => void;

  // Configuration:

  /** The largest unit which can be chosen. */
  maxUnit: TimeUnit;

  /** The smallest unit which can be chosen. Smaller units are set to zero. */
  minUnit: TimeUnit;

  /** Interval in minutes between selectable minute values. */
  minuteStep?: number;

  /** Interval in seconds between selectable second values. */
  secondStep?: number;
}

export const InputTime = ({
  border = true,
  className,
  defaultValue,
  disabled,
  id,
  intent = 'secondary',
  maxUnit,
  minUnit,
  minuteStep = DEFAULT_MINUTE_STEP,
  onChange,
  secondStep = DEFAULT_SECOND_STEP,
  value,
  variant = 'ghost',
  ...props
}: InputTimeProps): ReactElement => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = value ?? internalValue;
  const normalized = current ? normalizeTimeOfDay(current, minUnit, minuteStep, secondStep) : undefined;
  const parts = normalized ? getTimeOfDayParts(normalized) : undefined;

  const handleChange = (unit: TimeUnit, next: SelectValue | null): void => {
    if (typeof next !== 'number') {
      return;
    }
    const base = normalized ?? createFallbackTimeOfDay();
    const updated = normalizeTimeOfDay(
      setTimeOfDay(base, { ...getTimeOfDayParts(base), [UNIT_PARTS[unit]]: next }),
      minUnit,
      minuteStep,
      secondStep,
    );
    setInternalValue(updated);
    onChange?.(updated);
  };

  return (
    <div {...props} className={clsx(styles.inputTime, className)}>
      {getVisibleTimeUnits(minUnit, maxUnit).map((unit, i) => (
        <Fragment key={unit}>
          {i > 0 && <span className={styles.inputTimeSeparator}>:</span>}
          <Select
            border={border}
            disabled={disabled}
            id={i === 0 ? id : undefined}
            intent={intent}
            options={getTimeOptions(unit, minuteStep, secondStep)}
            placeholder="--"
            value={parts ? parts[UNIT_PARTS[unit]] : null}
            variant={variant}
            onChange={(next) => handleChange(unit, next)}
          />
        </Fragment>
      ))}
    </div>
  );
};

InputTime.displayName = 'InputTime';
