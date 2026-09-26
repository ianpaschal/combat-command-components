import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { TransferListPane } from './components/TransferListPane';
import { Button } from '../Button';
import { TransferListItem, TransferListItemState } from './TransferList.types';

import styles from './TransferList.module.scss';

export interface TransferListProps {
  availableLabel?: ReactNode;
  batch?: boolean;
  className?: string;
  defaultValue?: string[];
  disabled?: boolean;
  onChange?: (values: string[]) => void;
  options: TransferListItem[];
  renderItem?: (item: TransferListItem, state: TransferListItemState) => ReactNode;
  searchPlaceholder?: string;
  selectedLabel?: ReactNode;
  value?: string[];
}

export const TransferList = ({
  availableLabel = 'Available',
  batch = false,
  className,
  defaultValue,
  disabled = false,
  onChange,
  options,
  renderItem,
  searchPlaceholder = 'Filter...',
  selectedLabel = 'Selected',
  value: controlledValue,
}: TransferListProps): JSX.Element => {
  const [value, setValue] = useState<string[]>(controlledValue ?? defaultValue ?? []);

  const [stagedAvailable, setStagedAvailable] = useState<string[]>([]);
  const [stagedSelected, setStagedSelected] = useState<string[]>([]);

  const handleChange = (next: string[]) => {
    if (value === undefined) {
      setValue(next);
    }
    onChange?.(next);
  };

  const availableOptions = options.filter((option) => !value.includes(option.value));
  const selectedOptions = value
    .map((v) => options.find((option) => option.value === v))
    .filter((option) => option !== undefined);

  const checkedAvailable = stagedAvailable.filter((v) => availableOptions.some((o) => o.value === v));
  const checkedSelected = stagedSelected.filter((v) => selectedOptions.some((o) => o.value === v));

  const moveToSelected = (values: string[]) => {
    handleChange([...value, ...values.filter((v) => !value.includes(v))]);
    setStagedAvailable([]);
  };

  const moveToAvailable = (values: string[]) => {
    handleChange(value.filter((v) => !values.includes(v)));
    setStagedSelected([]);
  };

  return (
    <div
      className={clsx(styles.transferList, className)}
      data-disabled={disabled || undefined}
      data-orientation="horizontal"
      data-batch={batch || undefined}
    >
      <label className={clsx(styles.transferListAvailableLabel, styles.transferListHeader)}>
        <span className={styles.transferListLabel}>
          {availableLabel}
        </span>
        <span className={styles.transferListCount}>
          {availableOptions.length}
        </span>
      </label>
      <TransferListPane
        className={styles.transferListAvailableList}
        options={availableOptions}
        batch={batch}
        checked={checkedAvailable}
        onChange={batch ? setStagedAvailable : moveToSelected}
        disabled={disabled}
        emptyMessage="No matching items."
        renderItem={renderItem}
        searchPlaceholder={searchPlaceholder}
      />
      {batch && (
        <div className={styles.transferListControls}>
          <Button
            size="small"
            variant="ghost"
            border
            aria-label="Move all to selected"
            icon={<ChevronsRight />}
            onClick={() => moveToSelected(availableOptions.map((o) => o.value))}
            disabled={disabled || availableOptions.length === 0}
          />
          <Button
            size="small"
            variant="ghost"
            border
            aria-label="Move checked to selected"
            icon={<ChevronRight />}
            onClick={() => moveToSelected(checkedAvailable)}
            disabled={disabled || checkedAvailable.length === 0}
          />
          <Button
            size="small"
            variant="ghost"
            border
            aria-label="Move checked to available"
            icon={<ChevronLeft />}
            onClick={() => moveToAvailable(checkedSelected)}
            disabled={disabled || checkedSelected.length === 0}
          />
          <Button
            size="small"
            variant="ghost"
            border
            aria-label="Move all to available"
            icon={<ChevronsLeft />}
            onClick={() => moveToAvailable(selectedOptions.map((o) => o.value))}
            disabled={disabled || selectedOptions.length === 0}
          />
        </div>
      )}
      <label className={clsx(styles.transferListSelectedLabel, styles.transferListHeader)}>
        <span className={styles.transferListLabel}>
          {selectedLabel}
        </span>
        <span className={styles.transferListCount}>
          {selectedOptions.length}
        </span>
      </label>
      <TransferListPane
        className={styles.transferListSelectedList}
        options={selectedOptions}
        batch={batch}
        checked={checkedSelected}
        onChange={batch ? setStagedSelected : moveToAvailable}
        disabled={disabled}
        emptyMessage="Nothing selected."
        renderItem={renderItem}
        searchPlaceholder={searchPlaceholder}
      />
    </div>
  );
};

TransferList.displayName = 'TransferList';
