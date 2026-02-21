import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  PdfViewerConfig,
  PdfViewerControlHandlers,
  PdfViewerState,
} from './PdfViewer.types';

interface UsePdfViewerReturn {
  ref: RefObject<HTMLDivElement>;
  onLoadSuccess: (pdf: { numPages: number }) => void;
  state: PdfViewerState;
  config: PdfViewerConfig;
  controls: PdfViewerControlHandlers;
}

export const DEFAULT_CONFIG: PdfViewerConfig = {
  initialPage: 1,
  initialScale: 1,
  minScale: 0.25,
  maxScale: 4,
  scaleStep: 0.25,
};

export const usePdfViewer = (
  customConfig?: Partial<PdfViewerConfig>,
): UsePdfViewerReturn => {
  const config = {
    ...DEFAULT_CONFIG,
    ...(customConfig ?? {}),
  };
  const ref = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(config.initialPage);
  const [scale, setScale] = useState(config.initialScale);
  const isScrollingTo = useRef(false);

  const scrollToPage = useCallback((page: number) => {
    const container = ref.current;
    if (!container) {
      return;
    }
    const pageEl = container.querySelector(`[data-page-number="${page}"]`);
    if (!pageEl) {
      return;
    }
    isScrollingTo.current = true;
    pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      isScrollingTo.current = false; 
    }, 500);
  }, []);

  const onLoadSuccess = useCallback((pdf: { numPages: number }) => {
    setNumPages(pdf.numPages);
    setPageNumber(config.initialPage);
  }, [config.initialPage]);

  const goToPage = useCallback((page: number) => {
    if (numPages === null) {
      return;
    }
    const clamped = Math.max(1, Math.min(page, numPages));
    setPageNumber(clamped);
    scrollToPage(clamped);
  }, [numPages, scrollToPage]);

  const goToPreviousPage = useCallback(() => {
    setPageNumber((prev) => {
      const next = Math.max(1, prev - 1);
      scrollToPage(next);
      return next;
    });
  }, [scrollToPage]);

  const goToNextPage = useCallback(() => {
    if (numPages === null) {
      return;
    }
    setPageNumber((prev) => {
      const next = Math.min(numPages, prev + 1);
      scrollToPage(next);
      return next;
    });
  }, [numPages, scrollToPage]);

  // Track visible page on scroll
  useEffect(() => {
    const container = ref.current;
    if (!container || !numPages) {
      return;
    }

    const handleScroll = (): void => {
      if (isScrollingTo.current) {
        return;
      }
      const pages = container.querySelectorAll('[data-page-number]');
      const containerTop = container.scrollTop;
      const containerMid = containerTop + container.clientHeight / 3;

      let closestPage = 1;
      let closestDist = Infinity;
      pages.forEach((el) => {
        const pageTop = (el as HTMLElement).offsetTop;
        const dist = Math.abs(pageTop - containerMid);
        if (dist < closestDist) {
          closestDist = dist;
          closestPage = Number(el.getAttribute('data-page-number'));
        }
      });
      setPageNumber(closestPage);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(config.maxScale, prev + config.scaleStep));
  }, [config.maxScale, config.scaleStep]);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(config.minScale, prev - config.scaleStep));
  }, [config.minScale, config.scaleStep]);

  const zoomReset = useCallback(() => {
    setScale(config.initialScale);
  }, [config.initialScale]);

  return {
    ref,
    onLoadSuccess,
    state: {
      numPages,
      pageNumber,
      scale,
    },
    config,
    controls: {
      goToPage,
      goToPreviousPage,
      goToNextPage,
      zoomIn,
      zoomOut,
      zoomReset,
      setScale,
    },
  };
};
