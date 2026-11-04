import type { Meta, StoryObj } from '@storybook/react';

import { ChartGraph } from './ChartGraph';

type StoryArgs = {
  xTickCount: number;
  xTickSize: number;
  yTickCount: number;
  yTickSize: number;
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const getXTicks = (count: number): string[] => (
  Array.from({ length: count }, (_, i) => `${MONTHS[i % MONTHS.length]} ${Math.floor(i / MONTHS.length) + 1}`)
);

const getYTicks = (count: number): string[] => (
  Array.from({ length: count }, (_, i) => `Row ${i + 1}`)
);

const meta: Meta<StoryArgs> = {
  title: 'Components/ChartGraph',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'The frame of a chart with an x and a y axis. Drag the corner of the box to resize it. An axis with a tick size scrolls when the box is too small for it, with the other axis sticking in place. An axis without one fills the box.',
      },
    },
  },
  argTypes: {
    xTickCount: { control: { type: 'range', min: 1, max: 48, step: 1 } },
    xTickSize: { control: { type: 'range', min: 0, max: 160, step: 8 } },
    yTickCount: { control: { type: 'range', min: 1, max: 48, step: 1 } },
    yTickSize: { control: { type: 'range', min: 0, max: 80, step: 4 } },
  },
  render: ({
    xTickCount,
    xTickSize,
    yTickCount,
    yTickSize,
  }) => (
    <div
      style={{
        resize: 'both',
        overflow: 'hidden',
        width: 640,
        height: 360,
        border: '1px dashed #F8BBD0',
        backgroundColor: '#FDEEF4',
      }}
    >
      <ChartGraph
        x={{ ticks: getXTicks(xTickCount), tickSize: xTickSize || undefined }}
        y={{ ticks: getYTicks(yTickCount), tickSize: yTickSize || undefined }}
      />
    </div>
  ),
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Responsive: Story = {
  args: {
    xTickCount: 12,
    xTickSize: 0,
    yTickCount: 6,
    yTickSize: 0,
  },
};

export const FixedTickSize: Story = {
  args: {
    xTickCount: 24,
    xTickSize: 64,
    yTickCount: 16,
    yTickSize: 32,
  },
};
