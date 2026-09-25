import { CSSProperties } from 'react';

import {
  ElementIntent,
  ElementOrientation,
  ElementVariant,
} from '../../types';
import { ToggleGroupProps, ToggleGroupValue } from './ToggleGroup';

type ToggleGroupGroupProps = Pick<ToggleGroupProps, 'defaultValue' | 'multiple' | 'onChange' | 'value'>;

/**
 * Adapts this component's own `value`/`defaultValue`/`onChange` (a single
 * value when not `multiple`, matching how most consumers think about a
 * single-selection group) into the array-shaped props base-ui's underlying
 * `ToggleGroup` always expects, regardless of `multiple`.
 *
 * @param props - This component's own `value`/`defaultValue`/`onChange`/`multiple` props.
 * @returns `value`/`defaultValue`/`onValueChange` props, ready to spread onto base-ui's `ToggleGroup`.
 */
export const getResolvedProps = ({
  defaultValue,
  multiple,
  onChange,
  value,
}: ToggleGroupGroupProps): {
    defaultValue: ToggleGroupValue[] | undefined;
    onValueChange: (values: ToggleGroupValue[]) => void;
    value: ToggleGroupValue[] | undefined;
  } => ({
  value: multiple ? (value as ToggleGroupValue[] | undefined) : (
    value !== undefined ? [value as ToggleGroupValue] : undefined
  ),
  defaultValue: multiple ? (defaultValue as ToggleGroupValue[] | undefined) : (
    defaultValue !== undefined ? [defaultValue as ToggleGroupValue] : undefined
  ),
  onValueChange: (values) => {
    if (multiple) {
      (onChange as ((values: ToggleGroupValue[]) => void) | undefined)?.(values);
    } else {
      (onChange as ((value: ToggleGroupValue) => void) | undefined)?.(values[0]);
    }
  },
});

/**
 * Computes the root element's grid template properties.
 *
 * For equal-width/height items, sized to the widest/tallest one, without
 * measuring anything in JS: an explicit grid template where every item track is
 * `1fr` naturally equalizes them (unlike `flex: 1`, which doesn't equalize
 * siblings in a shrink-to-fit container).
 *
 * @param equal - Whether items should be forced to an equal size.
 * @param orientation - The group's orientation.
 * @param optionCount - The number of items, used to build one grid track per item.
 * @returns CSS grid template properties for the root element's inline `style`.
 */
export const getRootStyle = (
  equal: boolean,
  orientation: ElementOrientation,
  optionCount: number,
): CSSProperties => {
  const equalTemplate = equal ? Array.from({
    length: optionCount,
  }, () => '1fr').join(' var(--toggle-group-spacer-size, 0px) ') : undefined;
  return {
    gridTemplateColumns: orientation === 'vertical' ? undefined : equalTemplate,
    gridTemplateRows: orientation === 'vertical' ? equalTemplate : undefined,
  } as CSSProperties;
};

type VariantColors = {
  border: string;
  background: string;
  text?: string;
};

/**
 * Resolves a variant/intent pair down to the same border, background, and text
 * colors `variants.module.scss` would apply, so those colors can be reused
 * outside of `getStyleClassNames`' class-based approach - as CSS custom
 * properties consumed by `[data-pressed]`/adjacency selectors instead.
 *
 * @param elementVariant - The variant to resolve.
 * @param elementIntent - The intent to resolve.
 * @returns The border, background, and (when the variant sets one) text color.
 */
const getVariantColors = (
  elementVariant: ElementVariant,
  elementIntent: ElementIntent,
): VariantColors => {
  if (elementVariant === 'surface') {
    return {
      border: 'var(--color-card-border)',
      background: 'var(--color-card-bg)',
    };
  }
  return {
    border: elementVariant === 'solid' ? (
      `var(--color-solid-${elementIntent}-bg)`
    ) : (
      `var(--color-${elementVariant}-${elementIntent}-border)`
    ),
    background: `var(--color-${elementVariant}-${elementIntent}-bg)`,
    text: `var(--color-${elementVariant}-${elementIntent}-text)`,
  };
};

/**
 * Computes the divider's border/background color custom properties.
 *
 * Layers a background and border color on top of each other so that both
 * properties can support alpha and will match neighboring elements that have
 * variants applied. Exposes both the unpressed and pressed color sets, so
 * `ToggleGroup.module.scss` can pick between them with `:has()`/adjacency
 * selectors instead of this needing to know which neighbor is pressed.
 *
 * @param elementVariant - The unpressed variant of the item(s) the divider sits next to.
 * @param activeVariant - The pressed variant of the item(s) the divider sits next to.
 * @param elementIntent - The group's intent.
 * @returns CSS custom properties consumed by `ToggleGroup.module.scss`'s `&-spacer` rule.
 */
export const getSpacerStyle = (
  elementVariant: ElementVariant,
  activeVariant: ElementVariant,
  elementIntent: ElementIntent,
): CSSProperties => {
  const unpressed = getVariantColors(elementVariant, elementIntent);
  const pressed = getVariantColors(activeVariant, elementIntent);
  return {
    '--toggle-group-spacer-border-color': unpressed.border,
    '--toggle-group-spacer-background-color': unpressed.background,
    '--toggle-group-spacer-active-border-color': pressed.border,
    '--toggle-group-spacer-active-background-color': pressed.background,
  } as CSSProperties;
};

/**
 * Computes an item's pressed-state color custom properties.
 *
 * The item's own class names always reflect its unpressed variant; these
 * properties are picked up by a `[data-pressed]` CSS rule instead, so the
 * pressed/unpressed swap doesn't need to be decided in JS.
 *
 * @param activeVariant - The variant to apply once the item is pressed.
 * @param elementIntent - The group's intent.
 * @returns CSS custom properties consumed by `ToggleGroup.module.scss`'s `&-item[data-pressed]` rule.
 */
export const getItemPressedStyle = (
  activeVariant: ElementVariant,
  elementIntent: ElementIntent,
): CSSProperties => {
  const pressed = getVariantColors(activeVariant, elementIntent);
  return {
    '--toggle-group-item-pressed-border-color': pressed.border,
    '--toggle-group-item-pressed-background-color': pressed.background,
    '--toggle-group-item-pressed-color': pressed.text,
  } as CSSProperties;
};
