import { ReactNode } from 'react';

export type TransferListGroupKey = string;
export type TransferListItemValue = string;

export type TransferListItemDef = {
  value: string;
  label?: ReactNode;
  disabled?: boolean;
};

export type TransferListGroupDef = {
  key: TransferListGroupKey;
  title: ReactNode;
};

export type TransferListOrientation = 'horizontal' | 'vertical';

export type TransferListState = Record<TransferListItemValue, TransferListGroupKey>;

export type TransferListValue = Record<TransferListGroupKey, TransferListItemValue[]>;

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
