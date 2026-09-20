export interface MapPin<T> {
  data: T;
  id: string;
  lat: number;
  lng: number;
}

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
}
