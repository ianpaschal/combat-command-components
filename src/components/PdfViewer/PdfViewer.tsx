import {
  Document,
  Page,
  pdfjs,
} from 'react-pdf';
import clsx from 'clsx';

import { ScrollArea } from '../ScrollArea';
import { Spinner } from '../Spinner';
import { usePdfViewer } from './PdfViewer.hooks';
import { PdfViewerConfig } from './PdfViewer.types';
import { PdfViewerControls } from './PdfViewerControls';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import styles from './PdfViewer.module.scss';

const DEFAULT_WORKER_SRC = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.workerSrc = DEFAULT_WORKER_SRC;

export interface PdfViewerProps extends Partial<PdfViewerConfig> {
  className?: string;
  file: string | File | ArrayBuffer | null;
  fileName?: string;
  loading?: boolean;
  showControls?: boolean;
  workerSrc?: string;
}

export const PdfViewer = ({
  className,
  file,
  fileName,
  loading = false,
  showControls = true,
  workerSrc,
  ...restConfig
}: PdfViewerProps): JSX.Element => {
  if (workerSrc && pdfjs.GlobalWorkerOptions.workerSrc !== workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  }
  const viewer = usePdfViewer(restConfig);
  return (
    <div ref={viewer.containerRef} className={clsx(styles.pdfViewer, className)}>
      {(loading || viewer.state.numPages === null) && (
        <div className={styles.pdfViewerLoading}>
          <Spinner size={64} />
        </div>
      )}
      {!loading && (
        <ScrollArea className={styles.pdfViewerContent} onScroll={viewer.onScroll}>
          <div ref={viewer.ref} className={styles.pdfViewerContentInner}>
            <Document
              file={file}
              onLoadError={viewer.onLoadError}
              onLoadSuccess={viewer.onLoadSuccess}
              loading={<></>}
              error={(
                <div className={styles.pdfViewerError}>
                  Failed to load PDF file.
                </div>
              )}
            >
              {viewer.state.numPages !== null && Array.from({ length: viewer.state.numPages }, (_, i) => (
                <div key={`page_${i + 1}`} data-page-number={i + 1}>
                  <Page
                    pageNumber={i + 1}
                    scale={viewer.state.scale}
                    renderTextLayer
                    renderAnnotationLayer
                  />
                </div>
              ))}
            </Document>
          </div>
        </ScrollArea>
      )}
      {showControls && !loading && (
        <PdfViewerControls
          file={file}
          fileName={fileName}
          state={viewer.state}
          config={viewer.config}
          controls={viewer.controls}
        />
      )}
    </div>
  );
};
