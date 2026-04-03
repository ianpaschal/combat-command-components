import { ReactElement } from 'react';
import { Clock } from 'lucide-react';

import { InputPanelContentProps } from '../../../../components/InputPanel';
import { Select, SelectValue } from '../../../../components/Select';
import { Calendar } from '../Calendar';

import styles from './DateTimePicker.module.scss';

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: String(i).padStart(2, '0'),
}));

const createFallbackDate = (): Date => {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return d;
};

export interface DateTimePickerProps extends InputPanelContentProps<Date> {
  minuteStep?: number;
  secondStep?: number;
}

export const DateTimePicker = ({
  onChange,
  value: currentDate,
  minuteStep = 15,
  secondStep = 60,
}: DateTimePickerProps): ReactElement => {
  const workingDate = currentDate ?? createFallbackDate();

  const onDateChange = (selected: Date): void => {
    const newDate = new Date(selected);
    newDate.setHours(workingDate.getHours(), workingDate.getMinutes());
    onChange(newDate);
  };

  const onHoursChange = (v: SelectValue | null): void => {
    if (typeof v === 'number') {
      const newDate = new Date(workingDate);
      newDate.setHours(v);
      onChange(newDate);
    }
  };

  const minuteOptions = Array.from({ length: Math.floor(60 / minuteStep) }, (_, i) => ({
    value: i * minuteStep,
    label: String(i * minuteStep).padStart(2, '00'),
  }));

  const onMinutesChange = (v: SelectValue | null): void => {
    if (typeof v === 'number') {
      const newDate = new Date(workingDate);
      newDate.setMinutes(v);
      onChange(newDate);
    }
  };

  const secondOptions = Array.from({ length: Math.floor(60 / secondStep) }, (_, i) => ({
    value: i * secondStep,
    label: String(i * secondStep).padStart(2, '00'),
  }));

  const onSecondsChange = (v: SelectValue | null): void => {
    if (typeof v === 'number') {
      const newDate = new Date(workingDate);
      newDate.setSeconds(v);
      onChange(newDate);
    }
  };

  return (
    <div className={styles.dateTimePicker}>
      <Calendar className={styles.dateTimePickerCalendar} onSelect={onDateChange} selected={workingDate} />
      <div className={styles.dateTimePickerSeparator} />
      <div className={styles.dateTimePickerTime}>
        <Clock className={styles.dateTimePickerTimeIcon} />
        <Select
          onChange={onHoursChange}
          options={HOUR_OPTIONS}
          value={workingDate.getHours()}
        />
        <span className={styles.dateTimePickerTimeSeparator}>:</span>
        <Select
          onChange={onMinutesChange}
          options={minuteOptions}
          value={workingDate.getMinutes()}
          disabled={minuteOptions.length < 2}
        />
        {secondOptions.length > 1 && (
          <>
            <span className={styles.dateTimePickerTimeSeparator}>:</span>
            <Select
              onChange={onSecondsChange}
              options={secondOptions}
              value={workingDate.getSeconds()}
            />
          </>
        )}
      </div>
    </div>
  );
};

DateTimePicker.displayName = 'DateTimePicker';
