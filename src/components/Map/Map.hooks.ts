import { useMemo } from 'react';
import Supercluster, { ClusterProperties } from 'supercluster';

import { MapPin } from './Map.types';

const WORLD_BOUNDS: [number, number, number, number] = [-180, -85, 180, 85];

interface PinProperties<T> {
  pin: MapPin<T>;
}

export interface ClusterPoint {
  clusterId: number;
  count: number;
  expansionZoom: number;
  key: string;
  lat: number;
  lng: number;
  type: 'cluster';
}

export interface PinPoint<T> {
  key: string;
  lat: number;
  lng: number;
  pin: MapPin<T>;
  type: 'pin';
}

export type ClusteredPoint<T> = ClusterPoint | PinPoint<T>;

export interface UseClusteredPinsOptions {
  maxZoom?: number;
  radius?: number;
}

export const useClusteredPins = <T>(
  pins: MapPin<T>[],
  zoom: number,
  options?: UseClusteredPinsOptions,
): ClusteredPoint<T>[] => {
  const maxZoom = options?.maxZoom ?? 16;
  const radius = options?.radius ?? 60;

  const index = useMemo(() => {
    const cluster = new Supercluster<PinProperties<T>, ClusterProperties>({ maxZoom, radius });
    cluster.load(pins.map((pin) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [pin.lng, pin.lat],
      },
      properties: { pin },
    })));
    return cluster;
  }, [pins, maxZoom, radius]);

  return useMemo(() => index.getClusters(WORLD_BOUNDS, Math.round(zoom)).map((feature): ClusteredPoint<T> => {
    const [lng, lat] = feature.geometry.coordinates;

    if ('cluster' in feature.properties) {
      const { cluster_id: clusterId, point_count: count } = feature.properties;
      return {
        clusterId,
        count,
        expansionZoom: Math.min(index.getClusterExpansionZoom(clusterId), maxZoom),
        key: `cluster_${clusterId}`,
        lat,
        lng,
        type: 'cluster',
      };
    }

    return {
      key: feature.properties.pin.id,
      lat,
      lng,
      pin: feature.properties.pin,
      type: 'pin',
    };
  }), [index, zoom, maxZoom]);
};
