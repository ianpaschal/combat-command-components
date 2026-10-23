import { ReactElement } from 'react';
import { Clock } from 'lucide-react';

import { DEFAULT_MINUTE_STEP, DEFAULT_SECOND_STEP } from '../InputDateTime/InputDateTime.utils';
import { Select, SelectValue } from '../Select';

import styles from './TimePicker.module.scss';

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: String(i).padStart(2, '0'),
}));

export interface TimePickerValue {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TimePickerProps {
  minuteStep?: number;
  onChange: (value: TimePickerValue) => void;
  secondStep?: number;
  value: TimePickerValue;
}

export const TimePicker = ({
  minuteStep = DEFAULT_MINUTE_STEP,
  onChange,
  secondStep = DEFAULT_SECOND_STEP,
  value,
}: TimePickerProps): ReactElement => {
  if (process.env.NODE_ENV !== 'production') {
    if (60 % minuteStep !== 0) {
      console.warn(`TimePicker: minuteStep (${minuteStep}) must evenly divide 60.`);
    }
    if (60 % secondStep !== 0) {
      console.warn(`TimePicker: secondStep (${secondStep}) must evenly divide 60.`);
    }
  }

  const minuteOptions = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => ({
    value: i * minuteStep,
    label: String(i * minuteStep).padStart(2, '0'),
  }));

  const secondOptions = Array.from({ length: Math.ceil(60 / secondStep) }, (_, i) => ({
    value: i * secondStep,
    label: String(i * secondStep).padStart(2, '0'),
  }));

  const handleChange = (key: keyof TimePickerValue) => (v: SelectValue | null): void => {
    if (typeof v === 'number') {
      onChange({ ...value, [key]: v });
    }
  };

  return (
    <div className={styles.timePicker}>
      <Clock className={styles.timePickerIcon} />
      <Select
        aria-label="Hours"
        onChange={handleChange('hours')}
        options={HOUR_OPTIONS}
        value={value.hours}
      />
      <span className={styles.timePickerSeparator}>:</span>
      <Select
        aria-label="Minutes"
        onChange={handleChange('minutes')}
        options={minuteOptions}
        value={value.minutes}
        disabled={minuteOptions.length < 2}
      />
      {secondOptions.length > 1 && (
        <>
          <span className={styles.timePickerSeparator}>:</span>
          <Select
            aria-label="Seconds"
            onChange={handleChange('seconds')}
            options={secondOptions}
            value={value.seconds}
          />
        </>
      )}
    </div>
  );
};

TimePicker.displayName = 'TimePicker';
