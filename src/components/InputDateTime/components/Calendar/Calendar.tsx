import { ReactElement, useState } from 'react';
import clsx from 'clsx';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '../../../Button';

import styles from './Calendar.module.scss';

// FUTURE: Enable translations
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export interface CalendarProps {
  className?: string;
  onSelect: (date: Date) => void;
  selected: Date;
}

export const Calendar = ({
  className,
  onSelect,
  selected,
}: CalendarProps): ReactElement => {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected));
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const days = eachDayOfInterval({
    end: endOfWeek(endOfMonth(viewMonth)),
    start: startOfWeek(viewMonth),
  });

  const handlePrev = (): void => {
    setDirection('left');
    setViewMonth((m) => subMonths(m, 1));
  };

  const handleNext = (): void => {
    setDirection('right');
    setViewMonth((m) => addMonths(m, 1));
  };

  const handleDayClick = (day: Date): void => {
    if (!isSameMonth(day, viewMonth)) {
      setDirection(day > viewMonth ? 'right' : 'left');
      setViewMonth(startOfMonth(day));
    }
    onSelect(day);
  };

  return (
    <div className={clsx(styles.calendar, className)}>
      <div className={styles.calendarHeader}>
        <Button icon={<ChevronLeft />} onClick={handlePrev} type="button" variant="ghost" />
        <div
          className={styles.calendarHeaderMonth}
          data-direction={direction ?? undefined}
          key={viewMonth.toISOString()}
        >
          {format(viewMonth, 'MMMM yyyy')}
        </div>
        <Button icon={<ChevronRight />} onClick={handleNext} type="button" variant="ghost" />
        {DAY_NAMES.map((name) => (
          <div className={styles.calendarHeaderDay} key={name}>{name}</div>
        ))}
      </div>
      <div
        className={styles.calendarGrid}
        data-direction={direction ?? undefined}
        key={viewMonth.toISOString()}
      >
        {days.map((day) => (
          <Button
            className={styles.calendarGridDay}
            data-outside={!isSameMonth(day, viewMonth) || undefined}
            intent={isSameDay(day, selected) ? 'primary' : 'secondary'}
            key={day.toISOString()}
            onClick={() => handleDayClick(day)}
            text={format(day, 'd')}
            type="button"
            variant={isSameDay(day, selected) ? 'solid' : 'ghost'}
          />
        ))}
      </div>
    </div>
  );
};

Calendar.displayName = 'Calendar';
