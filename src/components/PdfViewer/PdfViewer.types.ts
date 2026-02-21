export interface PdfViewerConfig {
  initialPage: number;
  initialScale: number;
  minScale: number;
  maxScale: number;
  scaleStep: number;
}

export interface PdfViewerState {
  numPages: number | null;
  pageNumber: number;
  scale: number;
}

export interface PdfViewerControlHandlers {
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  goToPage: (page: number) => void;
  setScale: (scale: number) => void;
}
