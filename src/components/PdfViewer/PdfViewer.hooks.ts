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
  onLoadError: () => void;
  onLoadSuccess: (pdf: { numPages: number; getPage: (n: number) => Promise<{ getViewport: (opts: { scale: number }) => { width: number } }> }) => void;
  state: PdfViewerState;
  config: PdfViewerConfig;
  controls: PdfViewerControlHandlers;
}

export const DEFAULT_CONFIG: PdfViewerConfig = {
  initialPage: 1,
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
  const [scale, setScale] = useState(config.initialScale ?? 1);
  const fitWidthScaleRef = useRef<number>(1);
  const isScrollingTo = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(scrollTimeoutRef.current), []);

  const scrollToPage = useCallback((page: number) => {
    const container = ref.current;
    if (!container) {
      return;
    }
    const pageEl = container.querySelector(`[data-page-number="${page}"]`);
    if (!pageEl) {
      return;
    }
    clearTimeout(scrollTimeoutRef.current);
    isScrollingTo.current = true;
    pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingTo.current = false;
    }, 500);
  }, []);

  const onLoadError = useCallback(() => {
    setNumPages(null);
  }, []);

  const computeFitWidthScale = useCallback((pageWidth: number) => {
    const container = ref.current;
    if (!container) {
      return 1;
    }
    // Account for 1rem padding on each side of .react-pdf__Document and the vertical scrollbar
    const rem = parseFloat(getComputedStyle(container).fontSize);
    const availableWidth = container.clientWidth - rem * 2 - (container.offsetWidth - container.clientWidth || 16);
    return Math.max(config.minScale, Math.min(config.maxScale, availableWidth / pageWidth));
  }, [config.minScale, config.maxScale]);

  const onLoadSuccess = useCallback((pdf: { numPages: number; getPage: (n: number) => Promise<{ getViewport: (opts: { scale: number }) => { width: number } }> }) => {
    setNumPages(pdf.numPages);
    setPageNumber(config.initialPage);

    if (config.initialScale === undefined) {
      pdf.getPage(1).then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        const fitScale = computeFitWidthScale(viewport.width);
        fitWidthScaleRef.current = fitScale;
        setScale(fitScale);
      });
    }
  }, [config.initialPage, config.initialScale, computeFitWidthScale]);

  const goToPage = useCallback((page: number) => {
    if (numPages === null) {
      return;
    }
    const clamped = Math.max(1, Math.min(page, numPages));
    setPageNumber(clamped);
    scrollToPage(clamped);
  }, [numPages, scrollToPage]);

  const goToPreviousPage = useCallback(() => {
    if (numPages === null) {
      return;
    }
    const next = Math.max(1, pageNumber - 1);
    setPageNumber(next);
    scrollToPage(next);
  }, [numPages, pageNumber, scrollToPage]);

  const goToNextPage = useCallback(() => {
    if (numPages === null) {
      return;
    }
    const next = Math.min(numPages, pageNumber + 1);
    setPageNumber(next);
    scrollToPage(next);
  }, [numPages, pageNumber, scrollToPage]);

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
      const containerRect = container.getBoundingClientRect();
      const containerMid = container.scrollTop + container.clientHeight / 3;

      let closestPage = 1;
      let closestDist = Infinity;
      pages.forEach((el) => {
        const pageRect = el.getBoundingClientRect();
        const pageTop = (pageRect.top - containerRect.top) + container.scrollTop;
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
    setScale(config.initialScale ?? fitWidthScaleRef.current);
  }, [config.initialScale]);

  const clampedSetScale = useCallback((value: number) => {
    setScale(Math.min(config.maxScale, Math.max(config.minScale, value)));
  }, [config.minScale, config.maxScale]);

  return {
    ref,
    onLoadError,
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
      setScale: clampedSetScale,
    },
  };
};
