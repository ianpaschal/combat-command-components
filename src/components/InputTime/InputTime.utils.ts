import { TimePickerValue } from '../TimePicker';

export type TimeUnit = 'h' | 'm' | 's';

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
 * Formats the time of day of a date as the value of a native time input.
 *
 * @param date - The date to read the time of day from
 * @param minUnit - The smallest unit shown; seconds are only included for 's'
 * @returns A string like "09:30" or "09:30:15"
 */
export const getTimeInputValue = (date: Date, minUnit: TimeUnit): string => {
  const { hours, minutes, seconds } = getTimeOfDayParts(date);
  const parts = [hours, minUnit === 'h' ? 0 : minutes];
  if (minUnit === 's') {
    parts.push(seconds);
  }
  return parts.map((part) => `${part}`.padStart(2, '0')).join(':');
};

/**
 * Sets the time of day of a date from the value of a native time input. Units smaller than the
 * smallest unit are set to zero. The date portion is untouched.
 *
 * @param date - The date to start from (it is not mutated)
 * @param inputValue - A string like "09:30" or "09:30:15"
 * @param minUnit - The smallest unit which can be chosen
 * @returns A new date, or undefined if the input value is not a time (e.g. it was cleared)
 */
export const getTimeFromInputValue = (
  date: Date,
  inputValue: string,
  minUnit: TimeUnit,
): Date | undefined => {
  const [hours, minutes, seconds = 0] = inputValue.split(':').map(Number);
  if (hours === undefined || minutes === undefined || [hours, minutes, seconds].some(Number.isNaN)) {
    return undefined;
  }
  return setTimeOfDay(date, {
    hours,
    minutes: minUnit === 'h' ? 0 : minutes,
    seconds: minUnit === 's' ? seconds : 0,
  });
};
