import { TransferListItem } from './TransferList.types';

export const matchesFilter = (item: TransferListItem, filter?: string): boolean => {
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
