import {
  describe,
  expect,
  it,
} from 'vitest';

import { parseCalculatorDigits } from './parseCalculatorDigits';

describe('parseCalculatorDigits', () => {
  it('should remove characters which are not digits.', () => {
    expect(parseCalculatorDigits('1a2-3.4 5', 10)).toBe('12345');
  });
  it('should remove leading zeros.', () => {
    expect(parseCalculatorDigits('00120', 10)).toBe('120');
  });
  it('should be empty for no digits.', () => {
    expect(parseCalculatorDigits('', 10)).toBe('');
    expect(parseCalculatorDigits('abc', 10)).toBe('');
  });
  it('should be empty for only zeros.', () => {
    expect(parseCalculatorDigits('000', 10)).toBe('');
  });
  it('should drop extra digits at the end.', () => {
    expect(parseCalculatorDigits('123456', 4)).toBe('1234');
  });
  it('should count only digits (not leading zeros) towards the limit.', () => {
    expect(parseCalculatorDigits('0012345', 3)).toBe('123');
  });
});
