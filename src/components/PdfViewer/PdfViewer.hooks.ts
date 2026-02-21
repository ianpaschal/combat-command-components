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
  containerRef: RefObject<HTMLDivElement>;
  ref: RefObject<HTMLDivElement>;
  onLoadError: () => void;
  onLoadSuccess: (pdf: { numPages: number; getPage: (n: number) => Promise<{ getViewport: (opts: { scale: number }) => { width: number } }> }) => void;
  onScroll: () => void;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(config.initialPage);
  const [scale, setScale] = useState(config.initialScale ?? 1);
  const pdfPageWidthRef = useRef<number | null>(null);
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
    const container = containerRef.current;
    if (!container) {
      return 1;
    }
    // Account for 1rem padding on each side of .react-pdf__Document
    const rem = parseFloat(getComputedStyle(container).fontSize);
    const availableWidth = container.clientWidth - rem * 2;
    return Math.max(config.minScale, Math.min(config.maxScale, availableWidth / pageWidth));
  }, [config.minScale, config.maxScale]);

  const onLoadSuccess = useCallback((pdf: { numPages: number; getPage: (n: number) => Promise<{ getViewport: (opts: { scale: number }) => { width: number } }> }) => {
    setNumPages(pdf.numPages);
    setPageNumber(config.initialPage);

    pdf.getPage(1).then((page) => {
      const viewport = page.getViewport({ scale: 1 });
      pdfPageWidthRef.current = viewport.width;
      if (config.initialScale === undefined) {
        setScale(computeFitWidthScale(viewport.width));
      }
    });
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
  const onScroll = useCallback(() => {
    const container = ref.current;
    if (!container || !numPages || isScrollingTo.current) {
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
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale((prev) => {
      const nextStop = (Math.floor(prev / config.scaleStep) + 1) * config.scaleStep;
      return Math.min(config.maxScale, nextStop);
    });
  }, [config.maxScale, config.scaleStep]);

  const zoomOut = useCallback(() => {
    setScale((prev) => {
      const prevStop = (Math.ceil(prev / config.scaleStep) - 1) * config.scaleStep;
      return Math.max(config.minScale, prevStop);
    });
  }, [config.minScale, config.scaleStep]);

  const zoomToFit = useCallback(() => {
    if (pdfPageWidthRef.current !== null) {
      setScale(computeFitWidthScale(pdfPageWidthRef.current));
    }
  }, [computeFitWidthScale]);

  const clampedSetScale = useCallback((value: number) => {
    setScale(Math.min(config.maxScale, Math.max(config.minScale, value)));
  }, [config.minScale, config.maxScale]);

  return {
    containerRef,
    ref,
    onLoadError,
    onLoadSuccess,
    onScroll,
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
      zoomToFit,
      setScale: clampedSetScale,
    },
  };
};
