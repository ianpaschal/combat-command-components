import {
  ButtonHTMLAttributes,
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

import {
  ElementIntent,
  ElementSize,
  ElementVariant,
} from '../../types';
import { getStyleClassNames, sx } from '../../utils/getStyleClassNames';
import { useSafeCollisionPadding } from './Select.hooks';

import sizes from '../../style/sizes.module.scss';
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
  'size' |
  'value'
> {
  border?: boolean;
  defaultValue?: SelectValue | null;
  disabled?: boolean;
  intent?: ElementIntent;
  multiple?: false;
  onChange?: (value: SelectValue | null) => void;
  options: SelectOption[];
  placeholder?: ReactNode;
  renderValue?: (option: SelectOption | null) => ReactNode;
  size?: ElementSize;
  value?: SelectValue | null;
  variant?: ElementVariant;
}

export const Select = forwardRef<SelectRef, SelectProps>(({
  autoComplete,
  border = true,
  className,
  defaultValue,
  disabled,
  form,
  id,
  intent = 'secondary',
  name,
  onChange,
  options,
  placeholder = 'Select...',
  readOnly,
  renderValue,
  required,
  size = 'normal',
  type: _type,
  value,
  variant = 'ghost',
  ...triggerProps
}, ref): JSX.Element => {
  const collisionPadding = useSafeCollisionPadding(8);

  return (
    <BaseSelect.Root<SelectValue | null>
      autoComplete={autoComplete}
      defaultValue={defaultValue}
      disabled={disabled}
      form={form}
      name={name}
      readOnly={readOnly}
      required={required}
      value={value}
      onValueChange={onChange}
    >
      <BaseSelect.Trigger
        ref={ref}
        id={id}
        {...(triggerProps as ButtonHTMLAttributes<HTMLButtonElement>)}
        className={clsx(styles.selectTrigger, getStyleClassNames({
          corners: 'normal',
          intent,
          variant,
          border,
          size,
        }), className)}
      >
        <BaseSelect.Value className={styles.selectTriggerValue}>
          {(val: SelectValue | null) => {
            const opt = options.find((o) => (o.value === null ? val == null : o.value === val)) ?? null;
            if (opt === null) {
              return placeholder;
            }
            if (renderValue) {
              return renderValue(opt);
            }
            return opt.label ?? String(opt.value);
          }}
        </BaseSelect.Value>
        <BaseSelect.Icon className={clsx(styles.selectTriggerIcon, sizes.icon)}>
          <ChevronsUpDown />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          className={styles.positioner}
          sideOffset={8}
          collisionPadding={collisionPadding}
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
              {options.map((option, i) => (
                <BaseSelect.Item
                  className={clsx(styles.selectItem, ...getStyleClassNames({
                    intent: 'secondary',
                    variant: 'ghost',
                    corners: 'normal',
                    size,
                  }))}
                  key={`${i}-${option.value}`}
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
  );
});

Select.displayName = 'Select';
