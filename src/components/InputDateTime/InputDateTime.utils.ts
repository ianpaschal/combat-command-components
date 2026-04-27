export const DEFAULT_MINUTE_STEP = 15;
export const DEFAULT_SECOND_STEP = 60;

export const normalizeDate = (
  date?: Date,
  minuteStep: number = DEFAULT_MINUTE_STEP,
  secondStep: number = DEFAULT_SECOND_STEP,
): Date => {
  const d = date ? new Date(date) : new Date();
  const normalized = new Date(d);
  normalized.setMinutes(Math.floor(d.getMinutes() / minuteStep) * minuteStep);
  normalized.setSeconds(Math.floor(d.getSeconds() / secondStep) * secondStep, 0);
  return normalized;
};
