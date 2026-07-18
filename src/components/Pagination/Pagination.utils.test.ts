import {
  describe,
  expect,
  it,
} from 'vitest';

import { getPages } from './Pagination.utils';

describe('getPages', () => {
  it('returns every page as a single group when they all fit within slotCount.', () => {
    expect(getPages(1, 5, 7)).toEqual([[1, 2, 3, 4, 5]]);
  });

  it('returns every page when slotCount exactly matches lastPage.', () => {
    expect(getPages(1, 5, 5)).toEqual([[1, 2, 3, 4, 5]]);
  });

  it('always includes the first, last, and current pages even when slotCount only fits those.', () => {
    expect(getPages(10, 20, 5)).toEqual([[1], [10], [20]]);
  });

  it('expands the current page group towards the start before the end.', () => {
    expect(getPages(3, 10, 5)).toEqual([[1, 2, 3], [10]]);
  });

  it('collapses the gap near the start when the current page is near the beginning.', () => {
    expect(getPages(2, 20, 5)).toEqual([[1, 2, 3], [20]]);
  });

  it('collapses the gap near the end when the current page is near the end.', () => {
    expect(getPages(19, 20, 5)).toEqual([[1], [18, 19, 20]]);
  });

  it('expands outward to fill the available slots.', () => {
    expect(getPages(10, 20, 9)).toEqual([[1], [8, 9, 10, 11, 12], [20]]);
  });

  it('shows all pages as a single group once expansion reaches both ends.', () => {
    expect(getPages(5, 9, 9)).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9]]);
  });

  it('always shows the essential pages even when slotCount is smaller.', () => {
    expect(getPages(1, 10, 0)).toEqual([[1], [10]]);
  });
});
