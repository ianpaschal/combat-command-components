import { sx } from '../../../../utils';
import { TransferListItemProps } from '../../TransferList.types';

import styles from './TransferListButtonItem.module.scss';

export const TransferListButtonItem = ({
  children,
  disabled = false,
  onClick,
  value,
}: TransferListItemProps): JSX.Element => (
  <button
    type="button"
    className={sx({
      variant: 'ghost',
      corners: 'tight',
      size: 'small',
    }, styles.transferListButtonItem)}
    disabled={disabled}
    onClick={onClick}
  >
    <span>{children ?? value}</span>
  </button>
);

TransferListButtonItem.displayName = 'TransferListButtonItem';
