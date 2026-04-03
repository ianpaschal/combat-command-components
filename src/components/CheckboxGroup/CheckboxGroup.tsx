import {
  ElementRef,
  forwardRef,
  ReactNode,
} from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import clsx from 'clsx';
import { Check } from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './CheckboxGroup.module.scss';

export type CheckboxOption = {
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
};

export interface CheckboxGroupProps {
  className?: string;
  defaultValue?: string[];
  disabled?: boolean;
  onChange?: (values: string[]) => void;
  options: CheckboxOption[];
  value?: string[];
}

export const CheckboxGroup = forwardRef<ElementRef<'div'>, CheckboxGroupProps>(({
  className,
  defaultValue,
  disabled = false,
  onChange,
  options,
  value,
}, ref): JSX.Element => (
  <BaseCheckboxGroup
    ref={ref}
    className={clsx(styles.checkboxGroup, className)}
    value={value}
    defaultValue={defaultValue}
    disabled={disabled}
    onValueChange={onChange}
  >
    {options.map(({ value: v, label, description, disabled: optionDisabled }) => (
      <label
        key={v}
        className={styles.checkboxGroupItem}
        aria-disabled={disabled || optionDisabled}
      >
        <BaseCheckbox.Root
          className={clsx(getStyleClassNames({
            variant: 'ghost',
            intent: 'secondary',
            border: true,
            corners: 'tight',
          }), styles.checkboxGroupItemControl)}
          value={v}
          disabled={disabled || optionDisabled}
        >
          <BaseCheckbox.Indicator keepMounted className={styles.checkboxGroupItemIndicator}>
            <Check />
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
        <div className={styles.checkboxGroupItemContent}>
          {label && <span>{label}</span>}
          {description && (
            <span className={styles.checkboxGroupItemDescription}>{description}</span>
          )}
        </div>
      </label>
    ))}
  </BaseCheckboxGroup>
));

CheckboxGroup.displayName = 'CheckboxGroup';
