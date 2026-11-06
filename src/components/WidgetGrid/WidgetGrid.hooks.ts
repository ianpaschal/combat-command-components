import {
  CSSProperties,
  Ref,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { getColumnCount, WidgetGridColumns } from './WidgetGrid.utils';

export type WidgetGridConfig = {
  columns: WidgetGridColumns;
  gap?: number;
};

type UseWidgetGridResult = {
  ref: Ref<HTMLDivElement>;
  columnCount: number;
  style: CSSProperties;
};

export const useWidgetGrid = ({
  columns,
  gap = 16,
}: WidgetGridConfig): UseWidgetGridResult => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      setWidth(entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width);
    });

    resizeObserver.observe(element);
    const { paddingLeft, paddingRight } = getComputedStyle(element);
    setWidth(element.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight));
    return () => resizeObserver.disconnect();
  }, []);

  const columnCount = getColumnCount(columns, width);

  return {
    ref,
    columnCount,
    style: {
      gap,
      gridTemplateColumns: `repeat(${columnCount}, 1fr)`,

      // Columns stretch to fill the width, so rows follow them to keep each slot square.
      gridAutoRows: Math.max((width - (columnCount - 1) * gap) / columnCount, 0),
    },
  };
};
