import { ComponentPropsWithoutRef, ReactElement } from 'react';
import clsx from 'clsx';

import { WidgetGridContext } from './WidgetGrid.context';
import { useWidgetGrid, WidgetGridConfig } from './WidgetGrid.hooks';

import styles from './WidgetGrid.module.scss';

export interface WidgetGridProps extends ComponentPropsWithoutRef<'div'>, WidgetGridConfig {}

export const WidgetGrid = ({
  children,
  className,
  columns,
  gap,
  style,
  ...props
}: WidgetGridProps): ReactElement => {
  const { ref, columnCount, style: gridStyle } = useWidgetGrid({ columns, gap });

  return (
    <WidgetGridContext.Provider value={columnCount}>
      <div
        {...props}
        className={clsx(styles.widgetGrid, className)}
        ref={ref}
        style={{ ...gridStyle, ...style }}
      >
        {children}
      </div>
    </WidgetGridContext.Provider>
  );
};

WidgetGrid.displayName = 'WidgetGrid';
