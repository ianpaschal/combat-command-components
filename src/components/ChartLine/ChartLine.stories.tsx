import type { Meta, StoryObj } from '@storybook/react';

import { ChartLine, ChartLineDatum } from './ChartLine';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const getData = (count: number): ChartLineDatum[] => (
  Array.from({ length: count }, (_, i) => ({
    x: `${MONTHS[i % MONTHS.length]} ${Math.floor(i / MONTHS.length) + 1}`,
    value: Math.max(0, Math.round(40 + i * 1.5 + (Math.sin(i * 0.9) + Math.sin(i * 0.37) * 0.6) * 20)),
  }))
);

const meta: Meta<typeof ChartLine> = {
  title: 'Charts/ChartLine',
  component: ChartLine,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A value changing along an ordered x axis, such as time. Drag the corner of the box to resize it.',
      },
    },
  },
  argTypes: {
    className: { table: { disable: true } },
    color: { control: 'color' },
    data: { control: 'object' },
    formatValue: { table: { disable: true } },
    formatXTick: { control: false },
    padding: { control: 'number' },
    paddingX: { control: 'number' },
    paddingY: { control: 'number' },
    tickSizeX: { control: 'number' },
  },
  render: (args) => (
    <div
      style={{
        resize: 'both',
        overflow: 'hidden',
        width: 640,
        height: 360,
        boxSizing: 'border-box',
        padding: 16,
        border: '1px solid var(--color-card-border)',
        borderRadius: 'var(--border-radius-wide) var(--border-radius-wide) 0 var(--border-radius-wide)',
      }}
    >
      <ChartLine {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {
  args: {
    color: '#0090FF',
    data: getData(12),
    label: 'Games',
  },
};

export const FixedSize: Story = {
  args: {
    color: '#0090FF',
    data: getData(36),
    label: 'Games',
    tickSizeX: 48,
  },
};
