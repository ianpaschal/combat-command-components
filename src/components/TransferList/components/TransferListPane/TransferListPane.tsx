import { ReactNode, useState } from 'react';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

import { sx } from '../../../../utils/getStyleClassNames';
import { Button } from '../../../Button';
import { InputText } from '../../../InputText';
import { ScrollArea } from '../../../ScrollArea';
import {
  TransferListItem,
  TransferListItemProps,
  TransferListItemState,
} from '../../TransferList.types';
import { matchesFilter } from '../../TransferList.utils';
import { TransferListButtonItem } from '../TransferListButtonItem';
import { TransferListCheckboxItem } from '../TransferListCheckboxItem';

import styles from './TransferListPane.module.scss';

export interface TransferListPaneProps {
  className?: string;
  batch: boolean;
  checked: string[];
  disabled?: boolean;
  emptyMessage?: string;
  onChange: (value: string[]) => void;
  options: TransferListItem[];
  renderItem?: (item: TransferListItem, state: TransferListItemState) => ReactNode;
  searchPlaceholder?: string;
}

export const TransferListPane = ({
  className,
  batch,
  checked,
  disabled = false,
  emptyMessage = 'No items.',
  onChange,
  options,
  renderItem,
  searchPlaceholder = 'Filter...',
}: TransferListPaneProps): JSX.Element => {
  const [filter, setFilter] = useState('');
  const items: TransferListItemProps[] = options.flatMap((item) => {
    if (!matchesFilter(item, filter)) {
      return [];
    }
    const state: TransferListItemState = {
      checked: batch ? checked.includes(item.value) : undefined,
      disabled: disabled || !!item.disabled,
    };
    return [{
      children: renderItem ? renderItem(item, state) : item.label,
      disabled: state.disabled,
      onClick: !batch ? () => onChange([item.value]) : undefined,
      value: item.value,
    }];
  });
  return (
    <div className={clsx(styles.transferListPane, className)}>
      <InputText
        className={styles.transferListPaneSearch}
        icon={<Search />}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder={searchPlaceholder}
        disabled={disabled}
      />
      <div className={sx({
        corners: 'normal',
        border: true,
        variant: 'ghost',
      }, styles.transferListPaneBody)}>
        <BaseCollapsible.Root open={batch && checked.length > 0}>
          <BaseCollapsible.Panel className={styles.transferListPaneSelectionPanel}>
            <div className={styles.transferListPaneSelectionContent}>
              <span>{checked.length} selected</span>
              <Button
                role="button"
                variant="ghost"
                icon={<X />}
                onClick={() => onChange([])}
                aria-label="Deselect all"
                size="small"
                collapsePadding
              />
            </div>
          </BaseCollapsible.Panel>
        </BaseCollapsible.Root>
        <ScrollArea>
          {items.length === 0 ? (
            <div className={styles.transferListPaneEmptyState}>
              {emptyMessage}
            </div>
          ) : batch ? (
            <BaseCheckboxGroup
              className={styles.transferListPaneItems}
              value={checked}
              disabled={disabled}
              onValueChange={onChange}
            >
              {items.map((item) => (
                <TransferListCheckboxItem key={item.value} {...item} />
              ))}
            </BaseCheckboxGroup>
          ) : (
            <div className={styles.transferListPaneItems}>
              {items.map((item) => (
                <TransferListButtonItem key={item.value} {...item} />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

TransferListPane.displayName = 'TransferListPane';
