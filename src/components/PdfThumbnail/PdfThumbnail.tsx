import { useState } from 'react';
import {
  Document,
  Page,
  pdfjs,
} from 'react-pdf';
import clsx from 'clsx';
import type { PDFDocumentProxy } from 'pdfjs-dist';

import styles from './PdfThumbnail.module.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface PdfThumbnailProps {
  className?: string;
  file: string | File | ArrayBuffer | null;
  width?: number;
}

export const PdfThumbnail = ({
  className,
  file,
  width = 80,
}: PdfThumbnailProps): JSX.Element => {
  const [pageDimension, setPageDimension] = useState<'width' | 'height' | null>(null);

  const handleDocumentLoadSuccess = async (pdf: PDFDocumentProxy) => {
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    setPageDimension(viewport.width >= viewport.height ? 'width' : 'height');
  };

  return (
    <div
      className={clsx(styles.pdfThumbnail, className)}
      style={{ width, height: width }}
    >
      {!pageDimension && (
        <div className={styles.pdfThumbnailPlaceholder} />
      )}
      <Document
        file={file}
        onLoadSuccess={handleDocumentLoadSuccess}
        loading={null}
        error={null}
      >
        {pageDimension && (
          <Page
            pageNumber={1}
            {...(pageDimension === 'width' ? { width } : { height: width })}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        )}
      </Document>
    </div>
  );
};
