import { ReactNode, useState } from 'react';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import clsx from 'clsx';
import { Search } from 'lucide-react';

import { sx } from '../../../../utils/getStyleClassNames';
import { Checkbox } from '../../../Checkbox';
import { InputText } from '../../../InputText';
import { ScrollArea } from '../../../ScrollArea';
import {
  TransferListItemDef,
  TransferListItemProps,
  TransferListItemState,
} from '../../TransferList.types';
import { matchesFilter } from '../../TransferList.utils';
import { TransferListItem } from '../TransferListItem';

import styles from './TransferListGroup.module.scss';

export interface TransferListGroupProps {
  className?: string;
  checked: string[];
  disabled?: boolean;
  emptyMessage?: string;
  onChange: (value: string[]) => void;
  items: TransferListItemDef[];
  renderItem?: (item: TransferListItemDef, state: TransferListItemState) => ReactNode;
  searchPlaceholder?: string;
  title?: ReactNode;
}

export const TransferListGroup = ({
  className,
  checked,
  disabled = false,
  emptyMessage = 'No items.',
  onChange,
  items,
  renderItem,
  searchPlaceholder = 'Filter...',
  title,
}: TransferListGroupProps): JSX.Element => {
  const [filter, setFilter] = useState('');
  const itemProps: TransferListItemProps[] = items.flatMap((item) => {
    if (!matchesFilter(item, filter)) {
      return [];
    }
    const state: TransferListItemState = {
      checked: checked.includes(item.value),
      disabled: item.disabled,
    };
    return [{
      children: renderItem ? renderItem(item, state) : item.label,
      disabled: state.disabled,
      value: item.value,
    }];
  });
  const selectableValues = itemProps.filter((item) => !item.disabled).map((item) => item.value);
  const allChecked = selectableValues.length > 0 && selectableValues.every((v) => checked.includes(v));
  const someChecked = selectableValues.some((v) => checked.includes(v));
  const handleSelectAll = (next: boolean) => {
    onChange(next ? [
      ...checked,
      ...selectableValues.filter((v) => !checked.includes(v)),
    ] : checked.filter((v) => !selectableValues.includes(v)));
  };
  return (
    <div
      className={clsx(styles.transferListGroup, className)}
      data-disabled={disabled || undefined}
    >
      <label className={styles.transferListGroupHeader}>
        <span className={styles.transferListGroupHeaderText}>
          {title}
        </span>
        <span className={styles.transferListGroupHeaderCount}>
          {items.length}
        </span>
      </label>
      <InputText
        className={styles.transferListGroupSearch}
        icon={<Search />}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={searchPlaceholder}
        disabled={disabled}
      />
      <label
        className={sx({
          variant: 'ghost',
          intent: 'secondary',
          border: ['left', 'right'],
          size: 'small',
        }, styles.transferListGroupBulk)}
        data-disabled={disabled || undefined}
        onClick={(e) => disabled && e.preventDefault()}
      >
        <Checkbox
          value={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={handleSelectAll}
          disabled={selectableValues.length === 0}
          tabIndex={disabled ? -1 : undefined}
        />
        <span>{checked.length} selected</span>
      </label>
      <ScrollArea className={sx({
        corners: 'normal',
        border: true,
        variant: 'ghost',
      }, styles.transferListGroupScrollArea)} disabled={disabled || undefined}>
        {itemProps.length === 0 ? (
          <div className={styles.transferListGroupEmptyState}>
            {emptyMessage}
          </div>
        ) : (
          <BaseCheckboxGroup
            className={styles.transferListGroupItems}
            value={checked}
            onValueChange={onChange}
          >
            {itemProps.map((item) => (
              <TransferListItem key={item.value} {...item} />
            ))}
          </BaseCheckboxGroup>
        )}
      </ScrollArea>
    </div>
  );
};

TransferListGroup.displayName = 'TransferListGroup';
