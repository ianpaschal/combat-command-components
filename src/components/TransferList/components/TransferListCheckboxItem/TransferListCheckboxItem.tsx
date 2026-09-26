import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import clsx from 'clsx';
import { Check } from 'lucide-react';

import { sx } from '../../../../utils';
import { TransferListItemProps } from '../../TransferList.types';

import checkboxStyles from '../../../Checkbox/Checkbox.module.scss';
import styles from './TransferListCheckboxItem.module.scss';

export const TransferListCheckboxItem = ({
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
    }, styles.transferListCheckboxItem)}
    aria-disabled={disabled}
    role="button"
  >
    <BaseCheckbox.Root
      className={clsx(sx({
        variant: 'ghost',
        intent: 'secondary',
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

TransferListCheckboxItem.displayName = 'TransferListCheckboxItem';
