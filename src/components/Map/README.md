The `<Map />` component renders pins on a vector map, clustering them by proximity and zoom level, with an `onPinClick` callback so the consumer can show pin detail however it likes (a `<Drawer />`, typically).

It's built on [`react-map-gl/maplibre`](https://visgl.github.io/react-map-gl/) over [MapLibre GL JS](https://maplibre.org/) — open source (BSD-3), no account or token required, works with any vector-tile provider that serves plain-HTTPS TileJSON (MapTiler, Protomaps, CARTO, OpenFreeMap, a self-hosted tileserver, etc.).

Clustering is done with [`supercluster`](https://github.com/mapbox/supercluster) rather than a tile source's built-in clustering, so clusters render as regular `<Button />` elements and stay themeable with the rest of the design system.

### Map Style

`mapStyle` is a plain style URL (or inline style object). It must be plain HTTPS — Mapbox's own ready-made styles (e.g. `mapbox/streets-v12`) reference their tile source via a `mapbox://` scheme that MapLibre doesn't resolve, so pointing `mapStyle` at one of those renders a blank map. Any provider serving a plain-HTTPS style/TileJSON (see above) works as-is.
