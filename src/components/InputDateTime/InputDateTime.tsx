import { ReactElement } from 'react';
import { format } from 'date-fns';
import { CalendarClock } from 'lucide-react';

import { DateTimePicker } from './components/DateTimePicker/DateTimePicker';
import { InputPanel } from '../InputPanel';
import {
  DEFAULT_MINUTE_STEP,
  DEFAULT_SECOND_STEP,
  normalizeDate,
} from './InputDateTime.utils';

export interface InputDateTimeProps {
  className?: string;
  clearable?: boolean;
  defaultValue?: Date;
  disabled?: boolean;
  id?: string;
  minuteStep?: number;
  mobile?: boolean;
  name?: string;
  onChange?: (value: Date) => void;
  placeholder?: string;
  secondStep?: number;
  value?: Date;
};

export const InputDateTime = ({
  defaultValue,
  minuteStep = DEFAULT_MINUTE_STEP,
  secondStep = DEFAULT_SECOND_STEP,
  value,
  ...props
}: InputDateTimeProps): ReactElement => (
  <InputPanel<Date>
    {...props}
    closeOnChange={false}
    defaultValue={defaultValue ? normalizeDate(defaultValue, minuteStep, secondStep) : undefined}
    disablePadding
    icon={<CalendarClock />}
    renderContent={(props) => (
      <DateTimePicker secondStep={secondStep} minuteStep={minuteStep} {...props} />
    )}
    renderValue={(v?: Date): string => {
      if (!v) {
        return '';
      }
      if (secondStep !== 60) {
        return format(v, 'PPP, HH:mm:ss');
      }
      return format(v, 'PPP, HH:mm');
    }}
    value={value ? normalizeDate(value, minuteStep, secondStep) : undefined}
  />
);

InputDateTime.displayName = 'InputDateTime';
