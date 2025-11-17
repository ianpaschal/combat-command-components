export type IndicatorSide = 'top' | 'right' | 'bottom' | 'left';

export type IndicatorState = {
  visible?: boolean;
  border?: boolean;
};

export type IndicatorConfig = Partial<Record<IndicatorSide, IndicatorState>>;

/**
 * Type to track the state of an attribute-per-side of a box model.
 */
export type FourSidedState = Record<IndicatorSide, boolean>;
