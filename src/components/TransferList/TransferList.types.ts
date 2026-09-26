import { ReactNode } from 'react';

export type TransferListItem = {
  value: string;
  label?: ReactNode;
  disabled?: boolean;
};

export type TransferListItemState = {
  checked?: boolean;
  disabled?: boolean;
};

export type TransferListItemProps = {
  disabled?: boolean;
  value: string;
  onClick?: () => void;
  children?: ReactNode;
};
