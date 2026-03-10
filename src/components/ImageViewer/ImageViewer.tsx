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
  const [loaded, setLoaded] = useState(false);
  const loading = forceLoading || !loaded;
  return (
    <div className={clsx(styles.imageViewer, className)}>
      {loading && (
        <Spinner size={32} />
      )}
      <img
        src={url}
        alt={alt}
        className={styles.imageViewerImage}
        style={{ opacity: loading ? 0 : 1 }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};
