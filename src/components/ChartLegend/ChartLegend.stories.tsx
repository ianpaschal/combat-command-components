import type { Meta, StoryObj } from '@storybook/react';

import { ChartBar, ChartBarDatum } from '../ChartBar';
import { ChartLegend, ChartLegendSeries } from './ChartLegend';

const ERA_SERIES: ChartLegendSeries[] = [
  { key: 'early', color: '#1F3A5C', label: 'Early War' },
  { key: 'mid', color: '#35577D', label: 'Mid War' },
  { key: 'late', color: '#4F769C', label: 'Late War' },
  { key: 'fortress', color: '#6E94B6', label: 'Fortress Europe' },
  { key: 'desert', color: '#93B2CC', label: 'Desert Campaign' },
  { key: 'other', color: '#8B8D98', label: 'Other' },
];

const SIDE_SERIES: ChartLegendSeries[] = [
  { key: 'attacker', color: '#0090FF', label: 'As attacker' },
  { key: 'defender', color: '#F76B15', label: 'As defender' },
];

const SIDE_DATA: ChartBarDatum[] = [
  { x: 'Germany', values: { attacker: 58, defender: 50 } },
  { x: 'Soviet Union', values: { attacker: 47, defender: 55 } },
  { x: 'United States', values: { attacker: 52, defender: 46 } },
  { x: 'Great Britain', values: { attacker: 44, defender: 53 } },
];

const meta: Meta<typeof ChartLegend> = {
  title: 'Charts/ChartLegend',
  component: ChartLegend,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Names each series of a chart next to its color. Drag the corner of the box to resize it.',
      },
    },
  },
  argTypes: {
    className: { table: { disable: true } },
    series: { control: 'object' },
  },
  render: (args) => (
    <div
      style={{
        resize: 'horizontal',
        overflow: 'hidden',
        width: 320,
        boxSizing: 'border-box',
        padding: 16,
        border: '1px solid var(--color-card-border)',
        borderRadius: 'var(--border-radius-wide) var(--border-radius-wide) 0 var(--border-radius-wide)',
      }}
    >
      <ChartLegend {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    series: ERA_SERIES,
  },
};

export const WithChart: Story = {
  args: {
    series: SIDE_SERIES,
  },
  render: (args) => (
    <div
      style={{
        resize: 'both',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: 640,
        height: 360,
        boxSizing: 'border-box',
        padding: 16,
        border: '1px solid var(--color-card-border)',
        borderRadius: 'var(--border-radius-wide) var(--border-radius-wide) 0 var(--border-radius-wide)',
      }}
    >
      <ChartLegend {...args} />
      <div style={{ flex: 1, minHeight: 0 }}>
        <ChartBar data={SIDE_DATA} formatValue={(value) => `${value}%`} series={args.series} />
      </div>
    </div>
  ),
};
