import { isValidElement, ReactElement } from 'react';
import clsx from 'clsx';

import {
  CellPosition,
  ColumnDef,
  RowData,
} from './Table.types';

import variants from '../../style/variants.module.scss';
import styles from './Table.module.scss';

export interface TableCellProps<T extends RowData> {
  column: ColumnDef<T>;
  position?: CellPosition;
  row?: T;
  showScrollIndicator?: boolean;
}

export const TableCell = <T extends RowData>({
  column,
  position,
  row,
  showScrollIndicator = false,
}: TableCellProps<T>): JSX.Element => {
  const isHeader = !row;

  const renderInner = (): ReactElement => {
    if (isHeader) {
      if (column.renderHeader) {
        const el = column.renderHeader();
        return isValidElement(el) ? el : <h3>{el}</h3>;
      }
      return <h3>{column?.label ?? ''}</h3>;
    } else {
      if (column.renderCell) {
        const el = column.renderCell(row, position);
        return isValidElement(el) ? el : <span>{el}</span>;
      }
      return <span>{`${row?.[column.key] ?? ''}`}</span>;
    }
  };

  return (
    <div
      className={clsx([
        isHeader ? variants.staticNeutral : variants.staticMuted,
        styles.tableCell,
        column.className,
      ])}
      data-column-first={position?.column?.includes('first')}
      data-column-last={position?.column?.includes('last')}
      data-header={isHeader}
      data-row-first={position?.row?.includes('first')}
      data-row-last={position?.row?.includes('last')}
      data-x-align={column.xAlign ?? 'left'}
      data-y-align={column.yAlign ?? 'center'}
    >
      {renderInner()}
      {isHeader && (
        <div className={styles.tableScrollIndicator} data-visible={showScrollIndicator} />
      )}
    </div >
  );
};
