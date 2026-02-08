import {
  ElementRef,
  forwardRef,
  InputHTMLAttributes,
  MouseEvent,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import clsx from 'clsx';
import {
  Check,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  X,
} from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';
import { Button } from '../Button';

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
  clearable?: boolean;
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
  clearable = false,
  defaultValue = null,
  disabled = false,
  id,
  onChange,
  options,
  placeholder = 'Select...',
  value: controlledValue,
  ...props
}, ref): JSX.Element => {

  // Internal state (for uncontrolled usage):
  const [value, setValue] = useState<SelectValue | null>(controlledValue ?? defaultValue ?? null);

  // Sync controlled value to internal state:
  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const selectedOption = options.find((opt) => opt.value === value) ?? null;

  const handleValueChange = (option: SelectOption | null): void => {
    const newValue = option?.value ?? null;
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = (e: MouseEvent): void => {
    e.preventDefault();
    setValue(null);
    onChange?.(null);
  };

  return (
    <div className={styles.select}>
      <BaseSelect.Root<SelectOption>
        {...props}
        value={selectedOption}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <BaseSelect.Trigger
          ref={ref}
          id={id}
          className={clsx(styles.selectTrigger, getStyleClassNames({
            corners: 'normal',
            intent: 'neutral',
            variant: 'outlined',
          }), className)}
          data-clearable={clearable}
        >
          <BaseSelect.Value>
            {(option: SelectOption | null) => option?.label ?? option?.value ?? placeholder}
          </BaseSelect.Value>
          <BaseSelect.Icon className={styles.selectTriggerIcon}>
            <ChevronsUpDown />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner className={styles.positioner} sideOffset={8} collisionPadding={8}>
            <BaseSelect.Popup
              className={clsx(styles.selectPopup, getStyleClassNames({
                border: true,
                corners: 'normal',
                intent: 'neutral',
                variant: 'passive',
              }))}
              tabIndex={-1}
            >
              <BaseSelect.ScrollUpArrow className={styles.selectScrollArrow}>
                <ChevronUp />
              </BaseSelect.ScrollUpArrow>
              <BaseSelect.List className={styles.selectList}>
                {options.map((option) => (
                  <BaseSelect.Item
                    className={clsx(styles.selectItem, getStyleClassNames({
                      intent: 'neutral',
                      variant: 'ghost',
                      corners: 'normal',
                    }))}
                    key={option.value}
                    value={option}
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
              <BaseSelect.ScrollDownArrow className={styles.selectScrollArrow}>
                <ChevronDown />
              </BaseSelect.ScrollDownArrow>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
      {clearable && (
        <Button
          className={clsx(styles.selectClear, getStyleClassNames({
            corners: 'normal',
            intent: 'neutral',
            variant: 'outlined',
          }))}
          icon={<X />} onClick={handleClear}
          disabled={disabled || !value}
          tabIndex={0}
        />
      )}
    </div>
  );
});
