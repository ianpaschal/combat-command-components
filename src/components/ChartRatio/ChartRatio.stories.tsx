import type { Meta, StoryObj } from '@storybook/react';

import { ChartPieSlice } from '../ChartPie/ChartPie.types';
import { ChartRatio } from './ChartRatio';

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

const meta: Meta<typeof ChartRatio> = {
  title: 'Charts/ChartRatio',
  component: ChartRatio,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Parts of a whole, as segments of a single bar. Drag the corner of the box to resize it.',
      },
    },
  },
  argTypes: {
    className: { table: { disable: true } },
    cornerRadius: { control: 'number' },
    data: { control: 'object' },
    fill: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    formatValue: { table: { disable: true } },
    otherColor: { control: 'color' },
    otherThreshold: { control: { type: 'range', min: 0, max: 0.2, step: 0.01 } },
    remainderColor: { control: 'color' },
    spacing: { control: 'number' },
    thickness: { control: 'number' },
  },
  render: (args) => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'hidden',
        width: 480,
        boxSizing: 'border-box',
        padding: 16,
        border: '1px solid var(--color-card-border)',
        borderRadius: 'var(--border-radius-wide) var(--border-radius-wide) 0 var(--border-radius-wide)',
      }}
    >
      <ChartRatio {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: OUTCOMES,
  },
};

export const WithOther: Story = {
  args: {
    data: FACTIONS,
    otherThreshold: 0.05,
  },
};

export const WithRemainder: Story = {
  args: {
    data: OUTCOMES,
    fill: 0.7,
    remainderColor: 'var(--color-card-border)',
  },
};
