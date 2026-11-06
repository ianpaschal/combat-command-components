import type { Meta, StoryObj } from '@storybook/react';

import { ChartPie } from './ChartPie';
import { ChartPieSlice } from './ChartPie.types';

const OUTCOMES: ChartPieSlice[] = [
  { key: 'win', color: '#0090FF', label: 'Wins', value: 412 },
  { key: 'draw', color: '#8B8D98', label: 'Draws', value: 63 },
  { key: 'loss', color: '#F76B15', label: 'Losses', value: 389 },
];

const FACTIONS: ChartPieSlice[] = [
  { key: 'germany', color: '#0090FF', label: 'Germany', value: 214 },
  { key: 'sovietUnion', color: '#E5484D', label: 'Soviet Union', value: 168 },
  { key: 'unitedStates', color: '#30A46C', label: 'United States', value: 131 },
  { key: 'greatBritain', color: '#F76B15', label: 'Great Britain', value: 97 },
  { key: 'italy', color: '#8E4EC6', label: 'Italy', value: 22 },
  { key: 'finland', color: '#12A594', label: 'Finland', value: 14 },
  { key: 'hungary', color: '#D6409F', label: 'Hungary', value: 9 },
  { key: 'romania', color: '#FFC53D', label: 'Romania', value: 6 },
];

const meta: Meta<typeof ChartPie> = {
  title: 'Charts/ChartPie',
  component: ChartPie,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Parts of a whole, as slices of a pie or donut. Drag the corner of the box to resize it.',
      },
    },
  },
  argTypes: {
    className: { table: { disable: true } },
    cornerRadius: { control: 'number' },
    data: { control: 'object' },
    direction: { control: 'inline-radio', options: ['clockwise', 'counterclockwise'] },
    fill: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    formatValue: { table: { disable: true } },
    innerRadius: { control: { type: 'range', min: 0, max: 0.9, step: 0.05 } },
    origin: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    otherColor: { control: 'color' },
    otherThreshold: { control: { type: 'range', min: 0, max: 0.2, step: 0.01 } },
    remainderColor: { control: 'color' },
    spacing: { control: 'number' },
    sweep: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
  render: (args) => (
    <div
      style={{
        resize: 'both',
        overflow: 'hidden',
        width: 360,
        height: 360,
        boxSizing: 'border-box',
        padding: 16,
        border: '1px solid var(--color-card-border)',
        borderRadius: 'var(--border-radius-wide) var(--border-radius-wide) 0 var(--border-radius-wide)',
      }}
    >
      <ChartPie {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pie: Story = {
  args: {
    data: OUTCOMES,
  },
};

export const Donut: Story = {
  args: {
    data: OUTCOMES,
    innerRadius: 0.6,
  },
};

export const WithOther: Story = {
  args: {
    data: FACTIONS,
    innerRadius: 0.6,
    otherThreshold: 0.05,
  },
};

export const Hemisphere: Story = {
  args: {
    data: OUTCOMES,
    innerRadius: 0.6,
    origin: 'left',
    sweep: 0.5,
  },
};

export const WithRemainder: Story = {
  args: {
    data: OUTCOMES,
    innerRadius: 0.6,
    fill: 0.7,
    remainderColor: 'var(--color-card-border)',
  },
};

export const Gauge: Story = {
  args: {
    data: OUTCOMES,
    fill: 0.7,
    innerRadius: 0.6,
    origin: 'left',
    remainderColor: 'var(--color-card-border)',
    sweep: 0.5,
  },
};
