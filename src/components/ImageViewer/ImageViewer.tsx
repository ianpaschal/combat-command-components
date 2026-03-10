import { useState } from 'react';
import clsx from 'clsx';

import { Spinner } from '../Spinner';

import styles from './ImageViewer.module.scss';

export interface ImageViewerProps {
  className?: string;
  url: string;
  alt?: string;
  loading?: boolean;
}

export const ImageViewer = ({
  alt = '',
  className,
  loading: forceLoading = false,
  url,
}: ImageViewerProps): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const showLoading = forceLoading || loading;
  return (
    <div className={clsx(styles.imageViewer, className)}>
      {showLoading && (
        <Spinner size={32} />
      )}
      <img
        className={styles.imageViewerImage}
        src={url}
        alt={alt}
        style={{ opacity: showLoading ? 0 : 1 }}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
};
