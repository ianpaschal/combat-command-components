import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from '../../Button';
import { ImageViewer, ImageViewerProps } from '../ImageViewer';
import { randomPicsumUrl } from './InteractiveStory.utils';

export const InteractiveStory = ({ url: urlProp, loading, alt }: ImageViewerProps): JSX.Element => {
  const [url, setUrl] = useState(urlProp);
  const [key, setKey] = useState(0);
  const prevUrlPropRef = useRef(urlProp);

  useEffect(() => {
    if (urlProp === prevUrlPropRef.current) {
      return;
    }
    prevUrlPropRef.current = urlProp;
    setUrl(urlProp);
    setKey((k) => k + 1);
  }, [urlProp]);

  const loadRandom = () => {
    setUrl(randomPicsumUrl());
    setKey((k) => k + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '300px',
        gap: '0.5rem',
        width: '100%',
      }}>
        <ImageViewer key={key} url={url} alt={alt} loading={loading} />
      </div>
      <Button text="Load Random Image" onClick={loadRandom} />
    </div>
  );
};
