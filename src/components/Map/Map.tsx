import {
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  Map as MapGL,
  MapRef,
  Marker,
  ViewStateChangeEvent,
} from 'react-map-gl/maplibre';
import clsx from 'clsx';
import { MapPin as MapPinIcon } from 'lucide-react';
import { setWorkerUrl } from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';

import { Button } from '../Button';
import { useClusteredPins } from './Map.hooks';
import { MapPin, MapViewport } from './Map.types';

import 'maplibre-gl/dist/maplibre-gl.css';
import shadows from '../../style/shadows.module.scss';
import styles from './Map.module.scss';

/* Vite's dev-time dependency pre-bundler doesn't reliably preserve the relative
 * import.meta.url MapLibre's default worker setup relies on to load itself as a
 * module worker. That breaks silently: style, sprite and the TileJSON source
 * doc all load fine over plain fetch on the main thread, but actual vector tile
 * data is fetched and parsed inside the worker, so nothing ever renders and no
 * tile requests ever fire. Pointing at the real, unbundled worker asset URL
 * avoids the broken path entirely.
 */
setWorkerUrl(maplibreWorkerUrl);

export interface MapProps<T = unknown> {
  className?: string;
  clusterMaxZoom?: number;
  clusterRadius?: number;
  initialViewport: MapViewport;
  mapStyle: string;
  onPinClick?: (pin: MapPin<T>) => void;
  pins: MapPin<T>[];
  renderPin?: (pin: MapPin<T>) => ReactNode;
}

export const Map = <T,>({
  className,
  clusterMaxZoom,
  clusterRadius,
  initialViewport,
  mapStyle,
  onPinClick,
  pins,
  renderPin,
}: MapProps<T>): JSX.Element => {
  const mapRef = useRef<MapRef>(null);
  const [zoom, setZoom] = useState(initialViewport.zoom);

  const points = useClusteredPins(pins, zoom, {
    maxZoom: clusterMaxZoom,
    radius: clusterRadius,
  });

  const handleMove = useCallback((event: ViewStateChangeEvent): void => {
    setZoom(event.viewState.zoom);
  }, []);

  return (
    <div className={clsx(styles.map, className)}>
      <MapGL
        ref={mapRef}
        initialViewState={initialViewport}
        mapStyle={mapStyle}
        onMove={handleMove}
        style={{ width: '100%', height: '100%' }}
      >
        {points.map((point) => (
          point.type === 'cluster' ? (
            <Marker
              key={point.key}
              latitude={point.lat}
              longitude={point.lng}
              onClick={() => mapRef.current?.flyTo({
                center: [point.lng, point.lat],
                duration: 400,
                zoom: point.expansionZoom,
              })}
            >
              <Button
                className={clsx(shadows.elevation2, styles.marker)}
                intent="primary"
                rounded
                size="small"
                text={String(point.count)}
                variant="solid"
              />
            </Marker>
          ) : (
            <Marker
              key={point.key}
              latitude={point.lat}
              longitude={point.lng}
              onClick={() => onPinClick?.(point.pin)}
            >
              {renderPin ? renderPin(point.pin) : (
                <Button
                  className={clsx(shadows.elevation2, styles.marker)}
                  icon={<MapPinIcon />}
                  rounded
                  size="small"
                  variant="solid"
                />
              )}
            </Marker>
          )
        ))}
      </MapGL>
    </div>
  );
};

Map.displayName = 'Map';
