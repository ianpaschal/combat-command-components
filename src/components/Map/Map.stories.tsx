import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Drawer } from '../Drawer';
import { Map } from './Map';
import { MapPin } from './Map.types';

interface TournamentData {
  city: string;
  name: string;
}

// CARTO's free vector basemap: no signup/token needed, plain HTTPS TileJSON
// (unlike Mapbox's own styles, which reference tiles via a mapbox:// URL
// scheme MapLibre can't resolve on its own).
const DEMO_MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

// A cluster of venues around the Netherlands/Belgium plus a few standalone
// pins further out, so both clustered and individual markers are visible
// at the default zoom.
const TOURNAMENT_PINS: MapPin<TournamentData>[] = [
  { id: '1', lat: 51.9851, lng: 5.8987, data: { name: 'Arnhem Open', city: 'Arnhem, NL' } },
  { id: '2', lat: 51.8426, lng: 5.8546, data: { name: 'Nijmegen Nationals', city: 'Nijmegen, NL' } },
  { id: '3', lat: 52.0907, lng: 5.1214, data: { name: 'Utrecht Clash', city: 'Utrecht, NL' } },
  { id: '4', lat: 51.2194, lng: 4.4025, data: { name: 'Antwerp Assault', city: 'Antwerp, BE' } },
  { id: '5', lat: 50.8503, lng: 4.3517, data: { name: 'Brussels Breakout', city: 'Brussels, BE' } },
  { id: '6', lat: 52.5200, lng: 13.4050, data: { name: 'Berlin Blitz', city: 'Berlin, DE' } },
  { id: '7', lat: 51.5072, lng: -0.1276, data: { name: 'London Legion', city: 'London, UK' } },
  { id: '8', lat: 52.2297, lng: 21.0122, data: { name: 'Warsaw Wargame', city: 'Warsaw, PL' } },
];

const meta: Meta<typeof Map> = {
  title: 'Components/Map',
  component: Map,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    className: { table: { disable: true } },
    onPinClick: { table: { disable: true } },
    renderPin: { table: { disable: true } },
    pins: {
      control: false,
      description: 'Pins to render, each with lat/lng and an arbitrary data payload.',
      table: { category: 'Content' },
    },
    mapStyle: {
      control: 'text',
      description: 'A MapLibre-compatible style URL (plain HTTPS, not a mapbox:// one). This demo defaults to a free CARTO Voyager style; paste in your own to preview it here.',
      table: { category: 'Configuration' },
    },
    clusterRadius: {
      control: { type: 'range', min: 20, max: 120, step: 10 },
      description: 'Pixel radius within which pins are grouped into a cluster.',
      table: { category: 'Configuration' },
    },
    clusterMaxZoom: {
      control: { type: 'range', min: 8, max: 20, step: 1 },
      description: 'Zoom level above which pins always render individually.',
      table: { category: 'Configuration' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

interface MapWithDrawerStoryProps {
  clusterMaxZoom?: number;
  clusterRadius?: number;
  mapStyle: string;
}

const MapWithDrawerStory = ({
  clusterMaxZoom,
  clusterRadius,
  mapStyle,
}: MapWithDrawerStoryProps): JSX.Element => {
  const [selected, setSelected] = useState<MapPin<TournamentData> | null>(null);

  return (
    <>
      <Map
        clusterMaxZoom={clusterMaxZoom}
        clusterRadius={clusterRadius}
        initialViewport={{ latitude: 51, longitude: 6, zoom: 5 }}
        mapStyle={mapStyle}
        onPinClick={setSelected}
        pins={TOURNAMENT_PINS}
      />
      <Drawer
        onClose={() => setSelected(null)}
        open={selected !== null}
        side="right"
        title={selected?.data.name}
      >
        {selected && <p>{selected.data.city}</p>}
      </Drawer>
    </>
  );
};

export const Default: Story = {
  name: 'Pins & Clustering',
  args: {
    mapStyle: 'https://tiles.openfreemap.org/styles/bright',
  },
  render: (args) => <MapWithDrawerStory {...args} />,
};

export const Empty: Story = {
  name: 'No Pins',
  args: {
    initialViewport: { latitude: 51, longitude: 6, zoom: 5 },
    mapStyle: DEMO_MAP_STYLE,
    pins: [],
  },
};
