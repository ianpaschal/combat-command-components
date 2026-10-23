export type DurationUnit = 'w' | 'd' | 'h' | 'm' | 's';

export type DurationPart = {
  unit: DurationUnit;
  value: number;
};

export const UNIT_MS: Record<DurationUnit, number> = {
  w: 7 * 24 * 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  h: 60 * 60 * 1000,
  m: 60 * 1000,
  s: 1000,
};

const UNIT_ORDER: DurationUnit[] = ['w', 'd', 'h', 'm', 's'];

// How many of a unit make up one of the next unit up (e.g. 60 seconds, 24 hours). The top visible
// unit has no upper limit.
const getUnitBase = (unit: DurationUnit): number => (
  UNIT_MS[UNIT_ORDER[UNIT_ORDER.indexOf(unit) - 1]] / UNIT_MS[unit]
);

// How many digits the top unit can be typed with. This keeps the value well inside the range of
// safe integers (999999 weeks is about 6e14 ms).
const TOP_UNIT_DIGITS = 6;

export const getVisibleUnits = (minUnit: DurationUnit, maxUnit: DurationUnit): DurationUnit[] => (
  UNIT_ORDER.slice(UNIT_ORDER.indexOf(maxUnit), UNIT_ORDER.indexOf(minUnit) + 1)
);

/**
 * Gets how many digits can be typed. Every unit below the top one takes 2 digits, and the top unit
 * takes up to a fixed number, so the top unit has the same room however many units there are.
 *
 * @param minUnit - The smallest visible unit
 * @param maxUnit - The largest visible unit
 * @returns The most digits which can be typed
 */
export const getMaxDigits = (minUnit: DurationUnit, maxUnit: DurationUnit): number => (
  (getVisibleUnits(minUnit, maxUnit).length - 1) * 2 + TOP_UNIT_DIGITS
);

/**
 * Gets the largest unit which needs to be shown for a duration. This is the given unit, unless
 * the duration has reached the next unit up (e.g. 24 hours is 1 day), in which case that unit is
 * added, and so on.
 *
 * @param duration - The duration in milliseconds
 * @param maxUnit - The largest unit which is always shown
 * @returns The largest unit to show
 */
export const getEffectiveMaxUnit = (
  duration: number,
  maxUnit: DurationUnit,
): DurationUnit => {
  let unit = maxUnit;
  while (UNIT_ORDER.indexOf(unit) > 0 && duration >= UNIT_MS[UNIT_ORDER[UNIT_ORDER.indexOf(unit) - 1]]) {
    unit = UNIT_ORDER[UNIT_ORDER.indexOf(unit) - 1];
  }
  return unit;
};

/**
 * Splits a duration into its visible units (largest first), carrying lower
 * units into higher ones.
 *
 * @param duration - The duration in milliseconds
 * @param minUnit - The smallest visible unit
 * @param maxUnit - The largest visible unit
 * @returns The value of each visible unit, largest first
 */
export const getDurationParts = (
  duration: number,
  minUnit: DurationUnit,
  maxUnit: DurationUnit,
): DurationPart[] => {
  const units = getVisibleUnits(minUnit, maxUnit);
  let remaining = Math.floor(Math.max(duration, 0) / UNIT_MS[minUnit]);
  return [...units].reverse().map((unit, i) => {
    const isTop = i === units.length - 1;
    const value = isTop ? remaining : remaining % getUnitBase(unit);
    remaining = isTop ? remaining : Math.floor(remaining / getUnitBase(unit));
    return { unit, value };
  }).reverse();
};

export type DurationTypedDigits = {
  digits: string;
  maxUnit: DurationUnit;
};

/**
 * Gets the digits which would be typed (calculator style) to arrive at a
 * duration. Every unit below the top one takes 2 digits; the top unit takes the
 * rest.
 *
 * If digits were typed and they still arrive at the duration, they are returned
 * as typed (so nothing is reformatted mid-typing), and the units they were typed
 * in are used instead of the given largest unit.
 *
 * @param duration - The duration in milliseconds
 * @param minUnit - The smallest visible unit
 * @param maxUnit - The largest visible unit
 * @param typed - The digits as typed, and the largest unit they are read in
 * @returns The digits, without leading zeros
 */
export const getDurationDigits = (
  duration: number,
  minUnit: DurationUnit,
  maxUnit: DurationUnit,
  typed?: DurationTypedDigits | null,
): string => {
  if (typed && duration === getDurationFromDigits(typed.digits, minUnit, typed.maxUnit)) {
    return typed.digits;
  }
  return getDurationParts(duration, minUnit, typed?.maxUnit ?? maxUnit)
    .map(({ value }, i) => (i === 0 ? `${value}` : `${value}`.padStart(2, '0')))
    .join('')
    .replace(/^0+/, '');
};

/**
 * Lays typed digits out over the visible units (largest first), filled in from
 * the smallest unit up, exactly as typed. A unit below the top one can be given
 * more than it holds (e.g. 70 minutes), which is not carried until the duration
 * is calculated.
 *
 * @param digits - The digits as typed
 * @param minUnit - The smallest visible unit
 * @param maxUnit - The largest visible unit
 * @returns The value of each visible unit as typed, largest first
 */
export const getDigitParts = (
  digits: string,
  minUnit: DurationUnit,
  maxUnit: DurationUnit,
): DurationPart[] => {
  const units = [...getVisibleUnits(minUnit, maxUnit)].reverse();
  let rest = digits;
  return units.map((unit, i) => {
    const isTop = i === units.length - 1;
    const chunk = isTop ? rest : rest.slice(-2);
    rest = isTop ? '' : rest.slice(0, -2);
    return { unit, value: Number(chunk || 0) };
  }).reverse();
};

const UNIT_NAMES: Record<DurationUnit, string> = {
  w: 'week',
  d: 'day',
  h: 'hour',
  m: 'minute',
  s: 'second',
};

/**
 * Describes visible units in words (e.g. "3 hours 7 minutes"). Units without a value are left out.
 *
 * @param parts - The value of each visible unit, largest first
 * @param minUnit - The smallest visible unit, which is used if every value is zero
 * @returns The description
 */
export const getDurationDescription = (
  parts: DurationPart[],
  minUnit: DurationUnit,
): string => {
  const spoken = parts
    .filter(({ value }) => value > 0)
    .map(({ unit, value }) => `${value} ${UNIT_NAMES[unit]}${value === 1 ? '' : 's'}`);
  return spoken.length > 0 ? spoken.join(' ') : `0 ${UNIT_NAMES[minUnit]}s`;
};

/**
 * Gets the duration for typed digits. Units which were given more than they
 * hold (e.g. 90 minutes) carry into the unit above.
 *
 * @param digits - The digits as typed
 * @param minUnit - The smallest visible unit
 * @param maxUnit - The largest visible unit
 * @returns The duration in milliseconds
 */
export const getDurationFromDigits = (
  digits: string,
  minUnit: DurationUnit,
  maxUnit: DurationUnit,
): number => (
  getDigitParts(digits, minUnit, maxUnit).reduce((total, { unit, value }) => (
    total + value * UNIT_MS[unit]
  ), 0)
);
