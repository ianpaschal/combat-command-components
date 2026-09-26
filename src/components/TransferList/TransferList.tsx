import {
  CSSProperties,
  Fragment,
  ReactNode,
  useState,
} from 'react';
import clsx from 'clsx';

import { TransferListControls } from './components/TransferListControls';
import { TransferListGroup } from './components/TransferListGroup';
import {
  TransferListGroupDef,
  TransferListItemDef,
  TransferListItemState,
  TransferListOrientation,
  TransferListState,
  TransferListValue,
} from './TransferList.types';
import { stateToValue, valueToState } from './TransferList.utils';

import styles from './TransferList.module.scss';

type ListId = string;
type ItemValue = string;

export interface TransferListProps {
  className?: string;
  defaultValue?: TransferListValue;
  disabled?: boolean;
  groups: TransferListGroupDef[];
  onChange?: (value: TransferListValue) => void;
  items: TransferListItemDef[];
  orientation?: TransferListOrientation;
  renderItem?: (item: TransferListItemDef, state: TransferListItemState) => ReactNode;
  searchPlaceholder?: string;
  value?: TransferListValue;
}

export const TransferList = ({
  className,
  defaultValue,
  disabled = false,
  groups,
  onChange,
  items,
  orientation = 'horizontal',
  renderItem,
  searchPlaceholder = 'Filter...',
  value,
}: TransferListProps): JSX.Element => {
  const [state, setState] = useState<TransferListState>(valueToState(value ?? defaultValue ?? {}));

  const [staged, setStaged] = useState<Record<ListId, ItemValue[]>>({});

  const getListKey = (item: TransferListItemDef): string => (
    groups.some((list) => list.key === state[item.value]) ? state[item.value] : groups[0].key
  );

  const handleChange = (next: TransferListState) => {
    if (value === undefined) {
      setState(next);
    }
    onChange?.(stateToValue(next, groups, items));
  };

  const moveItems = (values: string[], listKey: string) => {
    handleChange({
      ...Object.fromEntries(items.map((item) => [item.value, getListKey(item)])),
      ...Object.fromEntries(values.map((v) => [v, listKey])),
    });
    setStaged((prev) => Object.fromEntries(
      Object.entries(prev).map(([key, checked]) => [
        key,
        checked.filter((v) => !values.includes(v)),
      ]),
    ));
  };

  const getChecked = (listKey: string): string[] => staged[listKey] ?? [];

  return (
    <div
      className={clsx(styles.transferList, className)}
      data-disabled={disabled || undefined}
      data-orientation={orientation}
      data-batch
      style={orientation === 'horizontal' ? {
        gridTemplateAreas: 'none',
        gridTemplateRows: 'auto',
        gridTemplateColumns: groups.map(() => '1fr').join(' auto '),
      } : {
        '--transfer-list-group-height': '10rem',
        gridTemplateAreas: 'none',
        gridTemplateRows: 'none',
        gridTemplateColumns: '1fr',
      } as CSSProperties}
    >
      {groups.map((group, index) => (
        <Fragment key={group.key}>
          <TransferListGroup
            title={group.title}
            items={items.filter((item) => getListKey(item) === group.key)}
            checked={getChecked(group.key)}
            onChange={(next) => setStaged((prev) => ({ ...prev, [group.key]: next }))}
            disabled={disabled}
            emptyMessage="No matching items."
            renderItem={renderItem}
            searchPlaceholder={searchPlaceholder}
          />
          <TransferListControls
            disabled={disabled}
            groups={groups}
            index={index}
            onMove={moveItems}
            orientation={orientation}
            staged={staged}
          />
        </Fragment>
      ))}
    </div>
  );
};

TransferList.displayName = 'TransferList';
