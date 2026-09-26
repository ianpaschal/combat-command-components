import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import clsx from 'clsx';
import { Check } from 'lucide-react';

import { sx } from '../../../../utils';
import { TransferListItemProps } from '../../TransferList.types';

import checkboxStyles from '../../../Checkbox/Checkbox.module.scss';
import styles from './TransferListItem.module.scss';

export const TransferListItem = ({
  children,
  disabled = false,
  value,
}: TransferListItemProps): JSX.Element => (
  <label
    className={sx({
      variant: 'ghost',
      intent: 'secondary',
      corners: 'tight',
      size: 'small',
    }, styles.transferListItem)}
    data-disabled={disabled || undefined}
    role="button"
  >
    <BaseCheckbox.Root
      className={(state) => clsx(sx({
        variant: state.checked ? 'solid' : 'ghost',
        intent: state.checked ? 'primary' : 'secondary',
        border: true,
        corners: 'tight',
      }), checkboxStyles.checkboxControl)}
      value={value}
      disabled={disabled}
    >
      <BaseCheckbox.Indicator keepMounted className={checkboxStyles.checkboxIndicator}>
        <Check />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
    <span>{children ?? value}</span>
  </label>
);

TransferListItem.displayName = 'TransferListItem';
