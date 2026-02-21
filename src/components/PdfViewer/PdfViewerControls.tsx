import { useCallback } from 'react';
import clsx from 'clsx';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Minus,
  Plus,
} from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';
import { Button } from '../Button';
import {
  PdfViewerConfig,
  PdfViewerControlHandlers,
  PdfViewerState,
} from './PdfViewer.types';
import { download } from './PdfViewer.utils';

import styles from './PdfViewerControls.module.scss';

export interface PdfViewerControlsProps {
  config: PdfViewerConfig;
  controls: PdfViewerControlHandlers;
  file: string | File | ArrayBuffer | null;
  fileName?: string;
  state: PdfViewerState;
}

export const PdfViewerControls = ({
  config,
  controls,
  file,
  fileName,
  state,
}: PdfViewerControlsProps): JSX.Element => {
  const handleDownload = useCallback(() => download(file, fileName), [file, fileName]);
  return (
    <div className={clsx(styles.pdfViewerControls, ...getStyleClassNames({
      border: 'top',
    }))}>
      <Button
        aria-label="Previous page"
        icon={<ChevronLeft />}
        variant="ghost"
        size="small"
        disabled={state.pageNumber <= 1}
        onClick={controls.goToPreviousPage}
      />
      <span className={styles.pdfViewerControlsPageInfo}>
        {state.numPages !== null ? `${state.pageNumber} / ${state.numPages}` : '-'}
      </span>
      <Button
        aria-label="Next page"
        icon={<ChevronRight />}
        variant="ghost"
        size="small"
        disabled={state.numPages === null || state.pageNumber >= state.numPages}
        onClick={controls.goToNextPage}
      />
      <div className={styles.pdfViewerControlsSeparator} />
      <Button
        aria-label="Zoom out"
        icon={<Minus />}
        variant="ghost"
        size="small"
        disabled={state.scale <= config.minScale}
        onClick={controls.zoomOut}
      />
      <span className={styles.pdfViewerControlsZoomInfo}>
        {Math.round(state.scale * 100)}%
      </span>
      <Button
        aria-label="Zoom in"
        icon={<Plus />}
        variant="ghost"
        size="small"
        disabled={state.scale >= config.maxScale}
        onClick={controls.zoomIn}
      />
      <Button
        aria-label="Reset zoom"
        icon={<Maximize />}
        variant="ghost"
        size="small"
        onClick={controls.zoomToFit}
      />
      <div className={styles.pdfViewerControlsSeparator} />
      <Button
        aria-label="Download"
        icon={<Download />}
        variant="ghost"
        size="small"
        disabled={!file}
        onClick={handleDownload}
      />
    </div>
  );
};
