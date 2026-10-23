export const MAX_DIGITS = 12;

export type AmountParts = {
  fraction: string;
  integer: string;

  /** How many of the leading digits are padding, not typed. */
  padding: number;
};

/**
 * Gets the digits which would be typed (calculator style) to arrive at an amount.
 *
 * @param amount - The amount in the currency's smallest unit (e.g. cents)
 * @returns The digits, without leading zeros
 */
export const getAmountDigits = (amount: number): string => (
  amount > 0 ? `${Math.floor(amount)}` : ''
);

/**
 * Gets the amount for typed digits.
 *
 * @param digits - The digits as typed
 * @returns The amount in the currency's smallest unit (e.g. cents)
 */
export const getAmountFromDigits = (digits: string): number => Number(digits || 0);

/**
 * Splits typed digits into a whole and a fractional part, padded with leading zeros so there is
 * always at least one whole digit (e.g. `5` is 0.05).
 *
 * @param digits - The digits as typed
 * @param decimals - How many digits are after the separator
 * @returns The whole and fractional parts, and how many leading digits are padding
 */
export const getAmountParts = (digits: string, decimals: number): AmountParts => {
  const padded = digits.padStart(decimals + 1, '0');
  const split = padded.length - decimals;
  return {
    fraction: padded.slice(split),
    integer: padded.slice(0, split),
    padding: padded.length - digits.length,
  };
};
