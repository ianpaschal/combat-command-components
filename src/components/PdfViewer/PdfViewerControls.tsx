import clsx from 'clsx';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react';

import { getStyleClassNames } from '../../utils/getStyleClassNames';
import { Button } from '../Button';
import {
  PdfViewerConfig,
  PdfViewerControlHandlers,
  PdfViewerState,
} from './PdfViewer.types';

import styles from './PdfViewerControls.module.scss';

export interface PdfViewerControlsProps {
  state: PdfViewerState;
  config: PdfViewerConfig;
  controls: PdfViewerControlHandlers;
}

export const PdfViewerControls = ({
  state,
  config,
  controls,
}: PdfViewerControlsProps): JSX.Element => (
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
      {state.numPages ? `${state.pageNumber} / ${state.numPages}` : '-'}
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
      icon={<RotateCcw />}
      variant="ghost"
      size="small"
      onClick={controls.zoomReset}
    />
  </div>
);
