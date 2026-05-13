import {
  CSSProperties,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';

export type MasonryConfig = {
  minColumns?: number;
  maxColumns?: number;
  minColumnWidth?: number;
  gap?: number;
  columnGap?: number;
  rowGap?: number;
};

type UseMasonryResult = {
  ref: Ref<HTMLDivElement>;
  columnCount: number;
  wrapperStyle: CSSProperties;
};

export const useMasonry = (config: MasonryConfig): UseMasonryResult => {
  const {
    minColumns = 1,
    maxColumns = 4,
    minColumnWidth = 200,
    gap = 16,
    columnGap,
    rowGap,
  } = config;

  const resolvedColumnGap = columnGap ?? gap;
  const resolvedRowGap = rowGap ?? gap;

  const clampedMinColumns = Math.min(minColumns, maxColumns);
  const clampedMaxColumns = Math.max(minColumns, maxColumns);

  const ref = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(clampedMinColumns);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const updateColumns = (containerWidth: number): void => {
      const effectiveGap = parseFloat(getComputedStyle(element).getPropertyValue('--masonry-column-gap')) || resolvedColumnGap;
      const rawColumns = Math.floor((containerWidth + effectiveGap) / (minColumnWidth + effectiveGap));
      const clampedColumns = rawColumns > 0 ? rawColumns : clampedMinColumns;
      setColumnCount(Math.min(clampedMaxColumns, Math.max(clampedMinColumns, clampedColumns)));
    };

    const resizeObserver = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
      updateColumns(containerWidth);
    });

    resizeObserver.observe(element);
    updateColumns(element.offsetWidth);
    return () => resizeObserver.disconnect();
  }, [clampedMinColumns, clampedMaxColumns, minColumnWidth, resolvedColumnGap]);

  return {
    ref,
    columnCount,
    wrapperStyle: {
      ['--masonry-column-gap' as string]: `${resolvedColumnGap}px`,
      ['--masonry-row-gap' as string]: `${resolvedRowGap}px`,
    },
  };
};
