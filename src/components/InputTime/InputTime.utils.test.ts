import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  getTimeFromInputValue,
  getTimeInputValue,
  getTimeOfDayParts,
  setTimeOfDay,
} from './InputTime.utils';

describe('InputTime.utils', () => {
  describe('getTimeOfDayParts', () => {
    it('should split a date into hours, minutes and seconds.', () => {
      expect(getTimeOfDayParts(new Date(2026, 5, 15, 9, 30, 45))).toEqual({ hours: 9, minutes: 30, seconds: 45 });
    });
  });

  describe('setTimeOfDay', () => {
    it('should only change the time portion.', () => {
      const date = new Date(2026, 5, 15, 9, 30, 45, 123);
      const next = setTimeOfDay(date, { hours: 17, minutes: 5, seconds: 0 });
      expect(next.getFullYear()).toBe(2026);
      expect(next.getMonth()).toBe(5);
      expect(next.getDate()).toBe(15);
      expect(next.getHours()).toBe(17);
      expect(next.getMinutes()).toBe(5);
      expect(next.getSeconds()).toBe(0);
      expect(next.getMilliseconds()).toBe(123);
    });
    it('should not mutate the original date.', () => {
      const date = new Date(2026, 5, 15, 9, 30);
      setTimeOfDay(date, { hours: 17, minutes: 0, seconds: 0 });
      expect(date.getHours()).toBe(9);
    });
  });

  describe('getTimeInputValue', () => {
    const date = new Date(2026, 5, 15, 9, 7, 5);
    it('should format hours and minutes by default.', () => {
      expect(getTimeInputValue(date, 'm')).toBe('09:07');
    });
    it('should include seconds only for the seconds unit.', () => {
      expect(getTimeInputValue(date, 's')).toBe('09:07:05');
    });
    it('should zero the minutes for the hours unit.', () => {
      expect(getTimeInputValue(date, 'h')).toBe('09:00');
    });
  });

  describe('getTimeFromInputValue', () => {
    const date = new Date(2026, 5, 15, 9, 30, 45, 123);
    it('should only change the time portion.', () => {
      const next = getTimeFromInputValue(date, '17:05', 'm');
      expect([next?.getFullYear(), next?.getMonth(), next?.getDate()]).toEqual([2026, 5, 15]);
      expect([next?.getHours(), next?.getMinutes(), next?.getSeconds()]).toEqual([17, 5, 0]);
      expect(next?.getMilliseconds()).toBe(123);
    });
    it('should read seconds only for the seconds unit.', () => {
      expect(getTimeFromInputValue(date, '17:05:20', 's')?.getSeconds()).toBe(20);
      expect(getTimeFromInputValue(date, '17:05:20', 'm')?.getSeconds()).toBe(0);
    });
    it('should zero the minutes for the hours unit.', () => {
      expect(getTimeFromInputValue(date, '17:05', 'h')?.getMinutes()).toBe(0);
    });
    it('should return undefined if the value is not a time.', () => {
      expect(getTimeFromInputValue(date, '', 'm')).toBeUndefined();
    });
  });
});
