export interface PdfViewerProps {
  className?: string;
  file: string | File | ArrayBuffer | null;
  initialPage?: number;
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  showControls?: boolean;
}
