import type { Meta, StoryObj } from '@storybook/react';

import { MasonryGrid } from './MasonryGrid';

const SAMPLE_ITEMS = [
  { height: 120, color: '#c7f2d3' },
  { height: 200, color: '#fde8c8' },
  { height: 80, color: '#d4e4fb' },
  { height: 160, color: '#f9d4d4' },
  { height: 100, color: '#e8d5fb' },
  { height: 220, color: '#d4f5fb' },
  { height: 140, color: '#fbf3d4' },
  { height: 90, color: '#fbd4ee' },
  { height: 180, color: '#d4fbdf' },
  { height: 110, color: '#fbddd4' },
  { height: 130, color: '#d4d9fb' },
  { height: 75, color: '#f2fbd4' },
];

const meta = {
  title: 'Masonry Grid',
  component: MasonryGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    minColumns: { control: { type: 'range', min: 1, max: 6, step: 1 } },
    maxColumns: { control: { type: 'range', min: 1, max: 8, step: 1 } },
    minColumnWidth: { control: { type: 'range', min: 80, max: 400, step: 10 } },
    gap: { control: { type: 'range', min: 0, max: 48, step: 2 } },
    columnGap: { control: { type: 'range', min: 0, max: 48, step: 2 } },
    rowGap: { control: { type: 'range', min: 0, max: 48, step: 2 } },
  },
} satisfies Meta<typeof MasonryGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleChildren = SAMPLE_ITEMS.map((item, index) => (
  <div
    key={index}
    style={{
      height: item.height,
      background: item.color,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      color: '#555',
      fontSize: 13,
    }}
  >
    #{index + 1} · {item.height}px
  </div>
));

export const Default: Story = {
  args: {
    minColumns: 1,
    maxColumns: 4,
    minColumnWidth: 150,
    columnGap: 12,
    rowGap: 12,
  },
  render: (args) => <MasonryGrid {...args}>{SampleChildren}</MasonryGrid>,
};
