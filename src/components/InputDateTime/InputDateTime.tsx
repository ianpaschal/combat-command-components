import { ReactElement } from 'react';
import { format } from 'date-fns';
import { CalendarClock } from 'lucide-react';

import { DateTimePicker } from './components/DateTimePicker/DateTimePicker';
import { InputPanel } from '../InputPanel';

const normalizeDate = (date?: Date, minuteStep: number = 5, secondStep: number = 60): Date => {
  const d = date ? new Date(date) : new Date();
  const normalized = new Date(d);
  normalized.setMinutes(Math.floor(d.getMinutes() / minuteStep) * minuteStep);
  normalized.setSeconds(Math.floor(d.getSeconds() / secondStep) * secondStep, 0);
  return normalized;
};

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
  minuteStep = 15,
  secondStep = 60,
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
        format(v, 'PPP, HH:mm:ss');
      }
      return format(v, 'PPP, HH:mm');
    }}
    value={value ? normalizeDate(value, minuteStep, secondStep) : undefined}
  />
);

InputDateTime.displayName = 'InputDateTime';
