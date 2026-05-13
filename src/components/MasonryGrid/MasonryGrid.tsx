import React, { Children } from 'react';

import { MasonryConfig, useMasonry } from './MasonryGrid.hooks';

import styles from './MasonryGrid.module.scss';

/**
 * MasonryGrid
 *
 * Props:
 *   minColumns     {number}  Minimum number of columns (default: 1)
 *   maxColumns     {number}  Maximum number of columns (default: 4)
 *   minColumnWidth {number}  Minimum column width in px used to compute column count (default: 200)
 *   gap            {number}  Shorthand for both columnGap and rowGap (default: 16)
 *   columnGap      {number}  Horizontal gap between columns in px (overrides gap)
 *   rowGap         {number}  Vertical gap between items in px (overrides gap)
 * 
 *   children       {node[]}  Items to lay out
 *   className      {string}  Class name applied to the wrapper div
 *   style          {object}  Inline styles applied to the wrapper div
 *
 * CSS vars (set on the wrapper, overridable externally):
 *   --masonry-column-gap
 *   --masonry-row-gap
 */
export interface MasonryGridProps extends MasonryConfig {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MasonryGrid = ({
  children,
  className,
  style,
  ...props
}: MasonryGridProps) => {
  const { ref, columnCount, wrapperStyle } = useMasonry(props);

  // Distribute children into columns top-to-bottom, left-to-right:
  const columns = Array.from({ length: columnCount }, () => [] as React.ReactNode[]);
  Children.forEach(children, (child, index) => {
    columns[index % columnCount].push(child);
  });

  return (
    <div ref={ref} className={className} style={{ ...wrapperStyle, ...style }}>
      <div className={styles.masonryGrid} style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.masonryGridColumn}>
            {column.map((child, rowIndex) => (
              <div key={rowIndex}>
                {child}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
