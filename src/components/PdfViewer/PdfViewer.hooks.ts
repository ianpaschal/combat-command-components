import {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface UsePdfViewerOptions {
  initialPage?: number;
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
}

interface UsePdfViewerReturn {
  containerRef: RefObject<HTMLDivElement>;
  numPages: number | null;
  pageNumber: number;
  scale: number;
  onDocumentLoadSuccess: (pdf: { numPages: number }) => void;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setScale: (scale: number) => void;
}

export const usePdfViewer = ({
  initialPage = 1,
  initialScale = 1,
  minScale = 0.25,
  maxScale = 4,
  scaleStep = 0.25,
}: UsePdfViewerOptions = {}): UsePdfViewerReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(initialScale);
  const isScrollingTo = useRef(false);

  const scrollToPage = useCallback((page: number) => {
    const container = containerRef.current;
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

  const onDocumentLoadSuccess = useCallback((pdf: { numPages: number }) => {
    setNumPages(pdf.numPages);
    setPageNumber(initialPage);
  }, [initialPage]);

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
    const container = containerRef.current;
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
    setScale((prev) => Math.min(maxScale, prev + scaleStep));
  }, [maxScale, scaleStep]);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(minScale, prev - scaleStep));
  }, [minScale, scaleStep]);

  const resetZoom = useCallback(() => {
    setScale(initialScale);
  }, [initialScale]);

  return {
    containerRef,
    numPages,
    pageNumber,
    scale,
    onDocumentLoadSuccess,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    zoomIn,
    zoomOut,
    resetZoom,
    setScale,
  };
};
