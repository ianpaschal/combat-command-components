import {
  Document,
  Page,
  pdfjs,
} from 'react-pdf';
import clsx from 'clsx';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react';

import { Button } from '../Button';
import { Spinner } from '../Spinner';
import { usePdfViewer } from './PdfViewer.hooks';
import { PdfViewerProps } from './PdfViewer.types';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './PdfViewer.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfViewer = ({
  className,
  file,
  initialPage = 1,
  initialScale = 1,
  minScale = 0.25,
  maxScale = 4,
  scaleStep = 0.25,
  showControls = true,
}: PdfViewerProps): JSX.Element => {
  const {
    containerRef,
    numPages,
    pageNumber,
    scale,
    onDocumentLoadSuccess,
    goToPreviousPage,
    goToNextPage,
    zoomIn,
    zoomOut,
    resetZoom,
  } = usePdfViewer({ initialPage, initialScale, minScale, maxScale, scaleStep });

  return (
    <div className={clsx(styles.pdfViewer, className)}>
      <div ref={containerRef} className={styles.pdfViewerContent}>
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={(
            <div className={styles.pdfViewerLoading}>
              <Spinner size={32} />
            </div>
          )}
        >
          {numPages && Array.from({ length: numPages }, (_, i) => (
            <div key={`page_${i + 1}`} data-page-number={i + 1}>
              <Page
                pageNumber={i + 1}
                scale={scale}
                renderTextLayer
                renderAnnotationLayer
              />
            </div>
          ))}
        </Document>
      </div>
      {showControls && (
        <div className={styles.pdfViewerControls}>
          <Button
            icon={<ChevronLeft />}
            variant="ghost"
            size="small"
            disabled={pageNumber <= 1}
            onClick={goToPreviousPage}
          />
          <span className={styles.pdfViewerPageInfo}>
            {numPages ? `${pageNumber} / ${numPages}` : '–'}
          </span>
          <Button
            icon={<ChevronRight />}
            variant="ghost"
            size="small"
            disabled={numPages === null || pageNumber >= numPages}
            onClick={goToNextPage}
          />
          <div className={styles.pdfViewerSeparator} />
          <Button
            icon={<Minus />}
            variant="ghost"
            size="small"
            disabled={scale <= minScale}
            onClick={zoomOut}
          />
          <span className={styles.pdfViewerZoomInfo}>
            {Math.round(scale * 100)}%
          </span>
          <Button
            icon={<Plus />}
            variant="ghost"
            size="small"
            disabled={scale >= maxScale}
            onClick={zoomIn}
          />
          <Button
            icon={<RotateCcw />}
            variant="ghost"
            size="small"
            onClick={resetZoom}
          />
        </div>
      )}
    </div>
  );
};
