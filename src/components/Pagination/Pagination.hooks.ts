import {
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

type UseMaxPagesResult = {
  trackRef: RefObject<HTMLDivElement>;
  slotRef: RefObject<HTMLButtonElement>;
  slotCount: number;
  slotWidth: number;
  gapWidth: number;
};

export const usePageSlots = (initial: number): UseMaxPagesResult => {
  const trackRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLButtonElement>(null);
  const [slotCount, setSlotCount] = useState<number>(initial);
  const [slotWidth, setSlotWidth] = useState<number>(0);
  const [gapWidth, setGapWidth] = useState<number>(0);

  useEffect(() => {
    const container = trackRef.current;
    const slotButton = slotRef.current;

    if (!container || !slotButton) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      const trackWidth = entry.contentRect.width;
      const buttonWidth = slotButton.getBoundingClientRect().width;
      const columnGap = parseFloat(getComputedStyle(container).columnGap) || 0;

      setSlotWidth(buttonWidth);
      setGapWidth(columnGap);
      setSlotCount(Math.max(1, Math.floor((trackWidth + columnGap) / (buttonWidth + columnGap))));
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return { trackRef, slotRef, slotCount, slotWidth, gapWidth };
};
