import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  getDigitParts,
  getDurationDescription,
  getDurationDigits,
  getDurationFromDigits,
  getDurationParts,
  getEffectiveMaxUnit,
  getMaxDigits,
  getVisibleUnits,
} from './InputDuration.utils';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

describe('InputDuration.utils', () => {
  describe('getMaxDigits', () => {
    it('should give the top unit the same room however many units there are.', () => {
      expect(getMaxDigits('m', 'm')).toBe(6);
      expect(getMaxDigits('m', 'h')).toBe(8);
      expect(getMaxDigits('s', 'w')).toBe(14);
    });
  });

  describe('getVisibleUnits', () => {
    it('should list the units from the largest to the smallest.', () => {
      expect(getVisibleUnits('s', 'h')).toEqual(['h', 'm', 's']);
      expect(getVisibleUnits('m', 'h')).toEqual(['h', 'm']);
      expect(getVisibleUnits('s', 'm')).toEqual(['m', 's']);
      expect(getVisibleUnits('m', 'm')).toEqual(['m']);
    });
  });

  describe('getEffectiveMaxUnit', () => {
    it('should keep the given unit until the next unit up is reached.', () => {
      expect(getEffectiveMaxUnit(23 * HOUR + 59 * MINUTE, 'h')).toBe('h');
      expect(getEffectiveMaxUnit(24 * HOUR, 'h')).toBe('d');
    });
    it('should keep adding units.', () => {
      expect(getEffectiveMaxUnit(7 * 24 * HOUR, 'h')).toBe('w');
      expect(getEffectiveMaxUnit(3 * 7 * 24 * HOUR, 'm')).toBe('w');
    });
    it('should not go past weeks.', () => {
      expect(getEffectiveMaxUnit(100 * 7 * 24 * HOUR, 'w')).toBe('w');
    });
    it('should keep a larger given unit.', () => {
      expect(getEffectiveMaxUnit(0, 'd')).toBe('d');
    });
  });

  describe('getDurationParts', () => {
    it('should carry lower units into higher ones.', () => {
      expect(getDurationParts(90 * MINUTE, 'm', 'h')).toEqual([
        { unit: 'h', value: 1 },
        { unit: 'm', value: 30 },
      ]);
    });
    it('should not cap the top unit.', () => {
      expect(getDurationParts(100 * HOUR + 5 * MINUTE, 'm', 'h')[0]).toEqual({
        unit: 'h',
        value: 100,
      });
      expect(getDurationParts(90 * MINUTE, 'm', 'm')).toEqual([{
        unit: 'm',
        value: 90,
      }]);
    });
    it('should floor to the smallest unit.', () => {
      expect(getDurationParts(90 * MINUTE + 45 * SECOND, 'm', 'h')[1]).toEqual({ unit: 'm', value: 30 });
    });
    it('should include seconds when they are the smallest unit.', () => {
      expect(getDurationParts(HOUR + 2 * MINUTE + 3 * SECOND, 's', 'h')).toEqual([
        { unit: 'h', value: 1 },
        { unit: 'm', value: 2 },
        { unit: 's', value: 3 },
      ]);
    });
    it('should treat a negative duration as zero.', () => {
      expect(getDurationParts(-5, 'm', 'h')).toEqual([
        { unit: 'h', value: 0 },
        { unit: 'm', value: 0 },
      ]);
    });
  });

  describe('units beyond hours', () => {
    it('should carry hours into days at 24 and days into weeks at 7.', () => {
      expect(getDurationParts(26 * HOUR, 'h', 'd')).toEqual([
        { unit: 'd', value: 1 },
        { unit: 'h', value: 2 },
      ]);
      expect(getDurationParts(8 * 24 * HOUR, 'd', 'w')).toEqual([
        { unit: 'w', value: 1 },
        { unit: 'd', value: 1 },
      ]);
    });
    it('should not cap the top unit.', () => {
      expect(getDurationParts(30 * 24 * HOUR, 'h', 'd')[0]).toEqual({ unit: 'd', value: 30 });
    });
  });

  describe('getDigitParts', () => {
    it('should lay digits out as typed, without carrying.', () => {
      expect(getDigitParts('170', 'm', 'h')).toEqual([
        { unit: 'h', value: 1 },
        { unit: 'm', value: 70 },
      ]);
    });
    it('should lay out every visible unit when there are no digits.', () => {
      expect(getDigitParts('', 's', 'h')).toEqual([
        { unit: 'h', value: 0 },
        { unit: 'm', value: 0 },
        { unit: 's', value: 0 },
      ]);
    });
    it('should build up a value one digit at a time.', () => {
      expect(getDigitParts('1700', 's', 'm')).toEqual([
        { unit: 'm', value: 17 },
        { unit: 's', value: 0 },
      ]);
    });
  });

  describe('getDurationFromDigits', () => {
    it('should fill in from the smallest unit up.', () => {
      expect(getDurationFromDigits('1', 'm', 'h')).toBe(MINUTE);
      expect(getDurationFromDigits('13', 'm', 'h')).toBe(13 * MINUTE);
      expect(getDurationFromDigits('130', 'm', 'h')).toBe(HOUR + 30 * MINUTE);
    });
    it('should carry a lower unit which is given too much.', () => {
      expect(getDurationFromDigits('90', 'm', 'h')).toBe(90 * MINUTE);
    });
    it('should not cap the top unit.', () => {
      expect(getDurationFromDigits('2500', 'm', 'h')).toBe(25 * HOUR);
    });
    it('should interpret digits by the smallest unit.', () => {
      expect(getDurationFromDigits('90', 's', 'm')).toBe(MINUTE + 30 * SECOND);
      expect(getDurationFromDigits('90', 'm', 'm')).toBe(90 * MINUTE);
    });
    it('should be zero for no digits.', () => {
      expect(getDurationFromDigits('', 'm', 'h')).toBe(0);
    });
  });

  describe('getDurationDescription', () => {
    it('should describe each unit with a value in words.', () => {
      const parts = getDurationParts(3 * HOUR + 7 * MINUTE, 'm', 'h');
      expect(getDurationDescription(parts, 'm')).toBe('3 hours 7 minutes');
    });
    it('should use the singular for one.', () => {
      const parts = getDurationParts(HOUR + MINUTE, 'm', 'h');
      expect(getDurationDescription(parts, 'm')).toBe('1 hour 1 minute');
    });
    it('should leave out units without a value.', () => {
      const parts = getDurationParts(2 * HOUR, 'm', 'h');
      expect(getDurationDescription(parts, 'm')).toBe('2 hours');
    });
    it('should describe zero in the smallest unit.', () => {
      expect(getDurationDescription(getDurationParts(0, 'm', 'h'), 'm')).toBe('0 minutes');
    });
  });

  describe('getDurationDigits', () => {
    it('should round trip with getDurationFromDigits.', () => {
      const duration = 3 * HOUR + 7 * MINUTE;
      expect(getDurationDigits(duration, 'm', 'h')).toBe('307');
      expect(getDurationFromDigits('307', 'm', 'h')).toBe(duration);
    });
    it('should re-derive digits after a carry.', () => {
      expect(getDurationDigits(getDurationFromDigits('90', 'm', 'h'), 'm', 'h')).toBe('130');
    });
    it('should be empty for zero.', () => {
      expect(getDurationDigits(0, 'm', 'h')).toBe('');
    });
    it('should give back the typed digits while they still arrive at the duration.', () => {
      const duration = getDurationFromDigits('170', 'm', 'h');
      expect(getDurationDigits(duration, 'm', 'h')).toBe('210');
      expect(getDurationDigits(duration, 'm', 'h', { digits: '170', maxUnit: 'h' })).toBe('170');
    });
    it('should lay out the duration in the typed units once the typed digits no longer match.', () => {
      expect(getDurationDigits(25 * HOUR, 'm', 'd')).toBe('10100');
      expect(getDurationDigits(25 * HOUR, 'm', 'd', { digits: '1', maxUnit: 'h' })).toBe('2500');
    });
    it('should lay out as the same parts as the duration.', () => {
      [0, 3 * HOUR + 7 * MINUTE, 25 * HOUR].forEach((duration) => {
        const digits = getDurationDigits(duration, 'm', 'h');
        expect(getDigitParts(digits, 'm', 'h')).toEqual(getDurationParts(duration, 'm', 'h'));
      });
    });
  });
});
