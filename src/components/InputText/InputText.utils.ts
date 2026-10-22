/**
 * Gets the digits which were typed into an input which is filled in from the end (calculator style).
 *
 * @param value - The input's raw value
 * @param maxDigits - The most digits allowed. Any extra typed digits (at the end) are dropped
 * @returns The digits, without leading zeros
 */
export const parseDigits = (value: string, maxDigits: number): string => (
  value.replace(/\D/g, '').replace(/^0+/, '').slice(0, maxDigits)
);
