import {
  describe,
  expect,
  it,
} from 'vitest';

import {
  getAmountDigits,
  getAmountFromDigits,
  getAmountParts,
} from './InputCurrency.utils';

describe('InputCurrency.utils', () => {
  describe('getAmountDigits', () => {
    it('should use the digits of the amount.', () => {
      expect(getAmountDigits(1250)).toBe('1250');
    });
    it('should be empty for zero or less.', () => {
      expect(getAmountDigits(0)).toBe('');
      expect(getAmountDigits(-5)).toBe('');
    });
  });

  describe('getAmountFromDigits', () => {
    it('should round trip with getAmountDigits.', () => {
      expect(getAmountFromDigits(getAmountDigits(1250))).toBe(1250);
    });
    it('should be zero for no digits.', () => {
      expect(getAmountFromDigits('')).toBe(0);
    });
  });

  describe('getAmountParts', () => {
    it('should split off the fraction.', () => {
      expect(getAmountParts('1250', 2)).toEqual({ fraction: '50', integer: '12', padding: 0 });
    });
    it('should pad so there is always a whole digit.', () => {
      expect(getAmountParts('', 2)).toEqual({ fraction: '00', integer: '0', padding: 3 });
      expect(getAmountParts('5', 2)).toEqual({ fraction: '05', integer: '0', padding: 2 });
      expect(getAmountParts('50', 2)).toEqual({ fraction: '50', integer: '0', padding: 1 });
    });
    it('should have no fraction without decimals.', () => {
      expect(getAmountParts('1250', 0)).toEqual({ fraction: '', integer: '1250', padding: 0 });
      expect(getAmountParts('', 0)).toEqual({ fraction: '', integer: '0', padding: 1 });
    });
  });
});
