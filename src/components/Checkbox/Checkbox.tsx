import { ElementRef, forwardRef } from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import clsx from 'clsx';
import { Check, Minus } from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './Checkbox.module.scss';

export interface CheckboxProps {
  className?: string;
  defaultValue?: boolean;
  disabled?: boolean;
  id?: string;
  indeterminate?: boolean;
  name?: string;
  onChange?: (checked: boolean) => void;
  value?: boolean;
}

export const Checkbox = forwardRef<ElementRef<typeof BaseCheckbox.Root>, CheckboxProps>(({
  className,
  defaultValue = false,
  disabled = false,
  id,
  indeterminate = false,
  name,
  onChange,
  value,
}, ref): JSX.Element => (
  <BaseCheckbox.Root
    ref={ref}
    id={id}
    className={clsx(getStyleClassNames({
      variant: 'ghost',
      intent: 'secondary',
      border: true,
      corners: 'tight',
    }), styles.checkboxControl, className)}
    checked={value}
    defaultChecked={defaultValue}
    disabled={disabled}
    indeterminate={indeterminate}
    name={name}
    onCheckedChange={onChange}
  >
    <BaseCheckbox.Indicator keepMounted className={styles.checkboxIndicator}>
      {indeterminate ? <Minus /> : <Check />}
    </BaseCheckbox.Indicator>
  </BaseCheckbox.Root>
));

Checkbox.displayName = 'Checkbox';
