import { ReactElement } from 'react';

import { InputPanelContentProps } from '../../../../components/InputPanel';
import { TimePicker, TimePickerValue } from '../../../../components/TimePicker';
import { DEFAULT_MINUTE_STEP, DEFAULT_SECOND_STEP } from '../../InputDateTime.utils';
import { Calendar } from '../Calendar';

import styles from './DateTimePicker.module.scss';

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
  minuteStep = DEFAULT_MINUTE_STEP,
  secondStep = DEFAULT_SECOND_STEP,
}: DateTimePickerProps): ReactElement => {
  const workingDate = currentDate ?? createFallbackDate();

  const onDateChange = (selected: Date): void => {
    const newDate = new Date(selected);
    newDate.setHours(workingDate.getHours(), workingDate.getMinutes(), workingDate.getSeconds(), workingDate.getMilliseconds());
    onChange(newDate);
  };

  const onTimeChange = ({ hours, minutes, seconds }: TimePickerValue): void => {
    const newDate = new Date(workingDate);
    newDate.setHours(hours, minutes, seconds);
    onChange(newDate);
  };

  return (
    <div className={styles.dateTimePicker}>
      <Calendar className={styles.dateTimePickerCalendar} onSelect={onDateChange} selected={workingDate} />
      <div className={styles.dateTimePickerSeparator} />
      <TimePicker
        minuteStep={minuteStep}
        onChange={onTimeChange}
        secondStep={secondStep}
        value={{
          hours: workingDate.getHours(),
          minutes: workingDate.getMinutes(),
          seconds: workingDate.getSeconds(),
        }}
      />
    </div>
  );
};

DateTimePicker.displayName = 'DateTimePicker';
