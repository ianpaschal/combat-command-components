import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import clsx from 'clsx';
import { Check, Minus } from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';

import styles from './Checkbox.module.scss';

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<typeof BaseCheckbox.Root>,
  'checked' | 'defaultChecked' | 'onCheckedChange' | 'value'
> {
  defaultValue?: boolean;
  onChange?: (checked: boolean) => void;
  value?: boolean;
}

export const Checkbox = forwardRef<ElementRef<typeof BaseCheckbox.Root>, CheckboxProps>(({
  className,
  defaultValue = false,
  indeterminate = false,
  onChange,
  value,
  ...props
}, ref): JSX.Element => (
  <BaseCheckbox.Root
    ref={ref}
    {...props}
    className={clsx(getStyleClassNames({
      variant: 'ghost',
      intent: 'secondary',
      border: true,
      corners: 'tight',
    }), styles.checkboxControl, className)}
    checked={value}
    defaultChecked={defaultValue}
    indeterminate={indeterminate}
    onCheckedChange={onChange}
  >
    <BaseCheckbox.Indicator keepMounted className={styles.checkboxIndicator}>
      {indeterminate ? <Minus /> : <Check />}
    </BaseCheckbox.Indicator>
  </BaseCheckbox.Root>
));

Checkbox.displayName = 'Checkbox';
