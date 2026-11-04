import type { Meta, StoryObj } from '@storybook/react';

import { ChartBar, ChartBarDatum } from './ChartBar';

const FACTIONS = [
  'Germany',
  'Soviet Union',
  'United States',
  'Great Britain',
  'Italy',
  'Finland',
  'Hungary',
  'Romania',
  'France',
  'Japan',
  'Poland',
  'Australia',
];

const getData = (count: number): ChartBarDatum[] => (
  FACTIONS.slice(0, count).map((x, i) => ({ x, value: Math.round(56 - i * 2.5 + Math.sin(i * 0.9) * 4) }))
);

const meta: Meta<typeof ChartBar> = {
  title: 'Charts/ChartBar',
  component: ChartBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'One value per category, as vertical or horizontal bars. Drag the corner of the box to resize it.',
      },
    },
  },
  argTypes: {
    barSize: { control: 'number' },
    className: { table: { disable: true } },
    color: { control: 'color' },
    data: { control: 'object' },
    formatValue: { table: { disable: true } },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    padding: { control: 'number' },
    paddingX: { control: 'number' },
    paddingY: { control: 'number' },
    tickSize: { control: 'number' },
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
      <ChartBar {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

const shared = {
  color: '#0090FF',
  label: 'Win rate',
};

export const Responsive: Story = {
  args: {
    ...shared,
    data: getData(6),
    formatValue: (value: number) => `${value}%`,
    label: 'Win rate',
    orientation: 'vertical',
  },
};

export const FixedSize: Story = {
  args: {
    ...shared,
    barSize: 16,
    color: '#0090FF',
    data: getData(12),
    formatValue: (value: number) => `${value}%`,
    orientation: 'horizontal',
    tickSize: 32,
  },
};
