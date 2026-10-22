import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  getTimeOfDayParts,
  getTimeOptions,
  getVisibleTimeUnits,
  normalizeTimeOfDay,
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

  describe('getVisibleTimeUnits', () => {
    it('should list the units from the largest to the smallest.', () => {
      expect(getVisibleTimeUnits('s', 'h')).toEqual(['h', 'm', 's']);
      expect(getVisibleTimeUnits('m', 'h')).toEqual(['h', 'm']);
      expect(getVisibleTimeUnits('s', 'm')).toEqual(['m', 's']);
      expect(getVisibleTimeUnits('h', 'h')).toEqual(['h']);
    });
  });

  describe('normalizeTimeOfDay', () => {
    const date = new Date(2026, 5, 15, 9, 47, 23, 500);
    it('should zero units smaller than the smallest unit.', () => {
      const next = normalizeTimeOfDay(date, 'h', 15, 60);
      expect([next.getHours(), next.getMinutes(), next.getSeconds()]).toEqual([9, 0, 0]);
      const withMinutes = normalizeTimeOfDay(date, 'm', 1, 60);
      expect([withMinutes.getHours(), withMinutes.getMinutes(), withMinutes.getSeconds()]).toEqual([9, 47, 0]);
    });
    it('should floor minutes and seconds to their steps.', () => {
      const next = normalizeTimeOfDay(date, 's', 15, 10);
      expect([next.getHours(), next.getMinutes(), next.getSeconds()]).toEqual([9, 45, 20]);
    });
    it('should leave the date alone and not mutate the original.', () => {
      const next = normalizeTimeOfDay(date, 'm', 5, 60);
      expect([next.getFullYear(), next.getMonth(), next.getDate()]).toEqual([2026, 5, 15]);
      expect(date.getMinutes()).toBe(47);
    });
  });

  describe('getTimeOptions', () => {
    it('should give every hour.', () => {
      const options = getTimeOptions('h', 15, 60);
      expect(options).toHaveLength(24);
      expect(options[9]).toEqual({ value: 9, label: '09' });
    });
    it('should follow the step for minutes and seconds.', () => {
      expect(getTimeOptions('m', 15, 60).map((o) => o.value)).toEqual([0, 15, 30, 45]);
      expect(getTimeOptions('s', 15, 30).map((o) => o.value)).toEqual([0, 30]);
    });
  });
});
