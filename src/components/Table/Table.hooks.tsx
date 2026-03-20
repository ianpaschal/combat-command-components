import {
  CSSProperties,
  RefObject,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ColumnDef, RowData } from './Table.types';
import { isValidCSSCalcValue } from './Table.utils';

export const useScrollbarOffset = (): [RefObject<HTMLDivElement>, number] => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<number>(0);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    const root = ref.current;
    const headerCell = root.querySelector<HTMLElement>('[data-header="true"]');
    if (!headerCell) {
      return;
    }
    setOffset(headerCell.clientHeight);
    const observer = new ResizeObserver(() => setOffset(headerCell.clientHeight));
    observer.observe(headerCell);
    return () => observer.disconnect();
  }, []);

  return [ref, offset];
};

export const useGridStyle = <T extends RowData>(
  columns: ColumnDef<T>[],
) => useMemo((): CSSProperties => {
  const templateColumns = columns.map((c, i) => {
    const isFirst = i === 0;
    const isLast = i + 1 === columns.length;
    const baseWidth = typeof c.width === 'number' ? `${c.width}px` : c.width ?? 'auto';
    if (baseWidth && isValidCSSCalcValue(baseWidth)) {
      if (isFirst) {
        return `calc(var(--user-table-padding-left, 0px) + ${baseWidth})`;
      }
      if (isLast) {
        return `calc(var(--user-table-padding-right, 0px) + ${baseWidth})`;
      }
    }
    return baseWidth;
  });
  return {
    gridTemplateColumns: templateColumns.join(' '),
  };
}, [columns]);
