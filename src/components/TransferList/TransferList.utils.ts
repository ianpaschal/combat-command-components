import {
  TransferListGroupDef,
  TransferListItemDef,
  TransferListState,
  TransferListValue,
} from './TransferList.types';

export const valueToState = (value: TransferListValue): TransferListState => (
  Object.fromEntries(
    Object.entries(value).flatMap(([groupKey, itemValues]) => (
      itemValues.map((itemValue) => [itemValue, groupKey])
    )),
  )
);

export const stateToValue = (
  state: TransferListState,
  groups: TransferListGroupDef[],
  options: TransferListItemDef[],
): TransferListValue => (
  Object.fromEntries(groups.map((group) => [
    group.key,
    options
      .filter((option) => (state[option.value] ?? groups[0].key) === group.key)
      .map((option) => option.value),
  ]))
);

export const matchesFilter = (item: TransferListItemDef, filter?: string): boolean => {
  const normalizedFilter = (filter ?? '').trim().toLowerCase();
  if (!normalizedFilter.length) {
    return true;
  }
  if (typeof item.label === 'string' && item.label.trim().toLowerCase().includes(normalizedFilter)) {
    return true;
  }
  if (item.value.trim().toLowerCase().includes(normalizedFilter)) {
    return true;
  }
  return false;
};
