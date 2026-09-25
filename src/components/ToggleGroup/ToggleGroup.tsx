import {
  ElementRef,
  forwardRef,
  Fragment,
  HTMLAttributes,
  ReactElement,
} from 'react';
import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import clsx from 'clsx';

import {
  ElementCorners,
  ElementIntent,
  ElementOrientation,
  ElementSize,
  ElementVariant,
} from '../../types';
import { getStyleClassNames } from '../../utils/getStyleClassNames';
import {
  getItemPressedStyle,
  getResolvedProps,
  getRootStyle,
  getSpacerStyle,
} from './ToggleGroup.utils';

import sizes from '../../style/sizes.module.scss';
import styles from './ToggleGroup.module.scss';

export type ToggleGroupValue = string;

export type ToggleGroupOption = {
  value: ToggleGroupValue;
  text?: string;
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
  disabled?: boolean;
  ariaLabel?: string;
};

interface ToggleGroupBaseProps extends Omit<HTMLAttributes<HTMLDivElement>,
  'defaultValue' |
  'onChange' |
  'value'
> {
  activeVariant?: ElementVariant;
  border?: boolean;
  corners?: boolean | ElementCorners;
  disabled?: boolean;
  equal?: boolean;
  intent?: ElementIntent;
  loopFocus?: boolean;
  options: ToggleGroupOption[];
  orientation?: ElementOrientation;
  rounded?: boolean;
  size?: ElementSize;
  variant?: ElementVariant;
}

/* `multiple` decides whether `value`/`defaultValue`/`onChange` work with a
 * single value (typical) or an array. Base UI's underlying `ToggleGroup` always
 * works with arrays, so this wraps/unwraps at this boundary rather than pushing
 * that array-handling onto every caller.
 */
export type ToggleGroupProps = ToggleGroupBaseProps & (
  | {
    multiple: true;
    defaultValue?: ToggleGroupValue[];
    onChange?: (value: ToggleGroupValue[]) => void;
    value?: ToggleGroupValue[];
  }
  | {
    multiple?: false;
    defaultValue?: ToggleGroupValue;
    onChange?: (value: ToggleGroupValue | undefined) => void;
    value?: ToggleGroupValue;
  }
);

export const ToggleGroup = forwardRef<ElementRef<typeof BaseToggleGroup>, ToggleGroupProps>(({
  activeVariant = 'solid',
  border = false,
  className,
  defaultValue,
  equal = false,
  intent = 'secondary',
  multiple,
  onChange,
  corners = 'normal',
  options,
  orientation = 'horizontal',
  rounded = false,
  size = 'normal',
  style,
  value,
  variant = 'shaded',
  ...props
}, ref): JSX.Element => (
  <BaseToggleGroup
    ref={ref}
    {...props}
    className={clsx(styles.toggleGroup, className)}
    data-border={border}
    data-equal={equal}
    style={{ ...style, ...getRootStyle(equal, orientation, options.length) }}
    orientation={orientation}
    multiple={multiple}
    {...getResolvedProps({
      defaultValue,
      multiple,
      onChange,
      value,
    })}
  >
    {options.map((option, index) => (
      <Fragment key={option.value}>
        {index > 0 && (
          <div
            className={styles.toggleGroupSpacer}
            style={getSpacerStyle(variant, activeVariant, intent)}
          />
        )}
        <BaseToggle
          value={option.value}
          disabled={option.disabled}
          aria-label={option.ariaLabel}
          data-reverse={option.iconPosition === 'end'}
          className={clsx(getStyleClassNames({
            variant,
            intent,
            corners,
            border,
            size,
            rounded,
            square: !!option.icon && !option.text,
          }), styles.toggleGroupItem)}
          style={getItemPressedStyle(activeVariant, intent)}
        >
          {option.icon && (
            <span className={sizes.icon}>{option.icon}</span>
          )}
          {option.text && (
            <span>{option.text}</span>
          )}
        </BaseToggle>
      </Fragment>
    ))}
  </BaseToggleGroup>
));

ToggleGroup.displayName = 'ToggleGroup';
