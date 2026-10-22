import { ReactElement } from 'react';

import { InputPanelContentProps } from '../../../../components/InputPanel';
import { InputTime } from '../../../../components/InputTime';
import { DEFAULT_SECOND_STEP } from '../../InputDateTime.utils';
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
  secondStep = DEFAULT_SECOND_STEP,
}: DateTimePickerProps): ReactElement => {
  const workingDate = currentDate ?? createFallbackDate();

  const onDateChange = (selected: Date): void => {
    const newDate = new Date(selected);
    newDate.setHours(workingDate.getHours(), workingDate.getMinutes(), workingDate.getSeconds(), workingDate.getMilliseconds());
    onChange(newDate);
  };

  return (
    <div className={styles.dateTimePicker}>
      <div className={styles.dateTimePickerContent}>
        <Calendar
          onSelect={onDateChange}
          selected={workingDate}
        />
        <InputTime
          minUnit={secondStep === DEFAULT_SECOND_STEP ? 'm' : 's'}
          onChange={onChange}
          value={workingDate}
        />
      </div>
    </div>
  );
};

DateTimePicker.displayName = 'DateTimePicker';
