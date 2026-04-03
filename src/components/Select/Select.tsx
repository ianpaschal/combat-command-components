import {
  ElementRef,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import clsx from 'clsx';
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
} from 'lucide-react';

import { getStyleClassNames, sx } from '../../utils/getStyleClassNames';

import styles from './Select.module.scss';

type SelectRef = ElementRef<typeof BaseSelect.Trigger>;

export type SelectValue = string | number;

export type SelectOption = {
  value: SelectValue | null;
  label?: ReactNode;
  disabled?: boolean;
};

export interface SelectProps extends Omit<
  InputHTMLAttributes<HTMLSelectElement>,
  'defaultValue' |
  'multiple' |
  'onChange' |
  'placeholder' |
  'value'
> {
  defaultValue?: SelectValue | null;
  disabled?: boolean;
  multiple?: false;
  onChange?: (value: SelectValue | null) => void;
  options: SelectOption[];
  placeholder?: ReactNode;
  value?: SelectValue | null;
}

export const Select = forwardRef<SelectRef, SelectProps>(({
  className,
  id,
  onChange,
  options,
  placeholder = 'Select...',
  value,
  ...props
}, ref): JSX.Element => (
  <BaseSelect.Root<SelectValue | null> {...props} value={value} onValueChange={onChange}>
    <BaseSelect.Trigger
      ref={ref}
      id={id}
      className={clsx(styles.selectTrigger, getStyleClassNames({
        corners: 'normal',
        intent: 'secondary',
        variant: 'ghost',
        border: true,
      }), className)}
    >
      <BaseSelect.Value>
        {(val: SelectValue | null) => {
          const opt = options.find((o) => o.value === val) ?? null;
          return opt?.label ?? opt?.value ?? placeholder;
        }}
      </BaseSelect.Value>
      <BaseSelect.Icon className={styles.selectTriggerIcon}>
        <ChevronsUpDown />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        className={styles.positioner}
        sideOffset={8}
        collisionPadding={8}
        alignItemWithTrigger={false} // See: https://github.com/mui/base-ui/issues/1922
      >
        <BaseSelect.Popup
          className={sx({
            border: true,
            corners: 'normal',
            elevation: 5,
            intent: 'secondary',
            variant: 'surface',
          }, styles.selectPopup)}
          tabIndex={-1}
        >
          <BaseSelect.ScrollUpArrow className={clsx(...getStyleClassNames({
            border: 'bottom',
            variant: 'surface',
          }), styles.selectScrollArrow)}>
            <ChevronUp />
          </BaseSelect.ScrollUpArrow>
          <BaseSelect.List className={styles.selectList}>
            {options.map((option) => (
              <BaseSelect.Item
                className={clsx(styles.selectItem, ...getStyleClassNames({
                  intent: 'secondary',
                  variant: 'ghost',
                  corners: 'normal',
                }))}
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                <BaseSelect.ItemIndicator className={styles.selectItemIndicator}>
                  <Check />
                </BaseSelect.ItemIndicator>
                <BaseSelect.ItemText className={styles.selectItemContent}>
                  {option.label}
                </BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.List>
          <BaseSelect.ScrollDownArrow className={clsx(...getStyleClassNames({
            border: 'top',
            variant: 'surface',
          }), styles.selectScrollArrow)}>
            <ChevronDown />
          </BaseSelect.ScrollDownArrow>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  </BaseSelect.Root >
));

Select.displayName = 'Select';
