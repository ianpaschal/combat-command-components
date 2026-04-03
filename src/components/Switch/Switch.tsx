import {
  CSSProperties,
  ElementRef,
  forwardRef,
  HTMLAttributes,
} from 'react';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import clsx from 'clsx';

import { ElementIntent } from '../../types';
import { sx } from '../../utils';

import styles from './Switch.module.scss';

export interface SwitchProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  defaultValue?: boolean;
  disabled?: boolean;
  intent?: ElementIntent;
  name?: string;
  onChange?: (value: boolean) => void;
  value?: boolean;
}

export const Switch = forwardRef<ElementRef<typeof BaseSwitch.Root>, SwitchProps>(({
  className,
  defaultValue = false,
  disabled = false,
  intent = 'primary',
  onChange,
  value,
  ...props
}, ref): JSX.Element => (
  <BaseSwitch.Root
    ref={ref}
    {...props}
    className={clsx(sx({
      variant: 'shaded',
      intent: 'secondary',
    }), styles.switchControl, className)}
    style={{
      '--switch-checked-track': `var(--color-solid-${!disabled ? intent : 'secondary'}-bg)`,
      '--switch-checked-thumb': `var(--color-solid-${!disabled ? intent : 'secondary'}-text)`,
    } as CSSProperties}
    checked={value}
    defaultChecked={defaultValue}
    disabled={disabled}
    onCheckedChange={onChange}
  >
    <BaseSwitch.Thumb className={styles.switchThumb} />
  </BaseSwitch.Root>
));

Switch.displayName = 'Switch';
