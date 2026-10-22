import { SelectOption } from '../Select';
import { TimePickerValue } from '../TimePicker';

export type TimeUnit = 'h' | 'm' | 's';

const TIME_UNIT_ORDER: TimeUnit[] = ['h', 'm', 's'];

export const createFallbackTimeOfDay = (): Date => {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return d;
};

export const getTimeOfDayParts = (date: Date): TimePickerValue => ({
  hours: date.getHours(),
  minutes: date.getMinutes(),
  seconds: date.getSeconds(),
});

/**
 * Sets the time of day of a date, leaving the date portion (and milliseconds) untouched.
 *
 * @param date - The date to start from (it is not mutated)
 * @param time - The hours, minutes and seconds to set
 * @returns A new date with the given time of day
 */
export const setTimeOfDay = (
  date: Date,
  { hours, minutes, seconds }: TimePickerValue,
): Date => {
  const next = new Date(date);
  next.setHours(hours, minutes, seconds);
  return next;
};

/**
 * Gets the units which are shown, from the largest to the smallest.
 *
 * @param minUnit - The smallest unit shown
 * @param maxUnit - The largest unit shown
 * @returns The visible units
 */
export const getVisibleTimeUnits = (minUnit: TimeUnit, maxUnit: TimeUnit): TimeUnit[] => {
  const minIndex = TIME_UNIT_ORDER.indexOf(minUnit);
  const maxIndex = TIME_UNIT_ORDER.indexOf(maxUnit);
  return TIME_UNIT_ORDER.slice(Math.min(minIndex, maxIndex), Math.max(minIndex, maxIndex) + 1);
};

/**
 * Makes a time of day fit what can be chosen. Units smaller than the smallest unit are zeroed, and
 * minutes and seconds are floored to their steps. The date portion is untouched.
 *
 * @param date - The date to start from (it is not mutated)
 * @param minUnit - The smallest unit which can be chosen
 * @param minuteStep - The interval between selectable minutes
 * @param secondStep - The interval between selectable seconds
 * @returns A new date
 */
export const normalizeTimeOfDay = (
  date: Date,
  minUnit: TimeUnit,
  minuteStep: number,
  secondStep: number,
): Date => {
  const { hours, minutes, seconds } = getTimeOfDayParts(date);
  const next = new Date(date);
  next.setHours(
    hours,
    minUnit === 'h' ? 0 : Math.floor(minutes / minuteStep) * minuteStep,
    minUnit === 's' ? Math.floor(seconds / secondStep) * secondStep : 0,
    0,
  );
  return next;
};

/**
 * Gets the values which can be chosen for a unit.
 *
 * @param unit - The unit
 * @param minuteStep - The interval between selectable minutes
 * @param secondStep - The interval between selectable seconds
 * @returns The options, each labelled with its value padded to 2 digits
 */
export const getTimeOptions = (
  unit: TimeUnit,
  minuteStep: number,
  secondStep: number,
): SelectOption[] => {
  const count = { h: 24, m: Math.ceil(60 / minuteStep), s: Math.ceil(60 / secondStep) }[unit];
  const step = { h: 1, m: minuteStep, s: secondStep }[unit];
  return Array.from({ length: count }, (_, i) => ({
    value: i * step,
    label: `${i * step}`.padStart(2, '0'),
  }));
};
