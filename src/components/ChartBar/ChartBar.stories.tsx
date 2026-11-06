import type { Meta, StoryObj } from '@storybook/react';

import {
  ChartBar,
  ChartBarDatum,
  ChartBarSeries,
} from './ChartBar';

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

const WIN_RATE_SERIES: ChartBarSeries[] = [
  { key: 'winRate', color: '#0090FF', label: 'Win rate' },
];

const SIDE_SERIES: ChartBarSeries[] = [
  { key: 'attacker', color: '#0090FF', label: 'As attacker' },
  { key: 'defender', color: '#F76B15', label: 'As defender' },
];

const OUTCOME_SERIES: ChartBarSeries[] = [
  { key: 'win', color: '#0090FF', label: 'Wins' },
  { key: 'draw', color: '#8B8D98', label: 'Draws' },
  { key: 'loss', color: '#F76B15', label: 'Losses' },
];

const getWinRate = (i: number): number => Math.round(56 - i * 2.5 + Math.sin(i * 0.9) * 4);

const getData = (count: number): ChartBarDatum[] => (
  FACTIONS.slice(0, count).map((x, i) => ({ x, values: { winRate: getWinRate(i) } }))
);

const getSideData = (count: number): ChartBarDatum[] => (
  FACTIONS.slice(0, count).map((x, i) => ({
    x,
    values: {
      attacker: getWinRate(i) + Math.round(Math.cos(i * 1.3) * 6),
      defender: getWinRate(i) - Math.round(Math.cos(i * 1.3) * 6),
    },
  }))
);

const getOutcomeData = (count: number): ChartBarDatum[] => (
  FACTIONS.slice(0, count).map((x, i) => {
    const draw = Math.round(8 + Math.sin(i * 1.7) * 4);
    const win = getWinRate(i) - Math.round(draw / 2);
    return { x, values: { win: win / 100, draw: draw / 100, loss: (100 - win - draw) / 100 } };
  })
);

const formatPercent = (value: number): string => `${Math.round(value * 100)}%`;

const meta: Meta<typeof ChartBar> = {
  title: 'Charts/ChartBar',
  component: ChartBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'One or more series per category, as grouped or stacked bars, vertical or horizontal. Drag the corner of the box to resize it.',
      },
    },
  },
  argTypes: {
    barSize: { control: 'number' },
    categoryTickSize: { control: 'number' },
    className: { table: { disable: true } },
    cornerRadius: { control: 'number' },
    data: { control: 'object' },
    edgeLabels: { control: 'inline-radio', options: ['shift', 'center'] },
    formatValue: { table: { disable: true } },
    mode: { control: 'inline-radio', options: ['grouped', 'stacked'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    padding: { control: 'number' },
    paddingX: { control: 'number' },
    paddingY: { control: 'number' },
    paddingTop: { control: 'number' },
    paddingRight: { control: 'number' },
    paddingBottom: { control: 'number' },
    paddingLeft: { control: 'number' },
    scrollToEnd: { control: 'boolean' },
    series: { control: 'object' },
    spacing: { control: 'number' },
    valueTickSize: { control: 'number' },
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
  formatValue: (value: number) => `${value}%`,
  series: WIN_RATE_SERIES,
};

export const Responsive: Story = {
  args: {
    ...shared,
    data: getData(6),
    orientation: 'vertical',
  },
};

export const FixedSize: Story = {
  args: {
    ...shared,
    barSize: 16,
    data: getData(12),
    orientation: 'horizontal',
    categoryTickSize: 32,
  },
};

export const Grouped: Story = {
  args: {
    ...shared,
    data: getSideData(6),
    series: SIDE_SERIES,
  },
};

export const Stacked: Story = {
  args: {
    barSize: 16,
    data: getOutcomeData(12),
    formatValue: formatPercent,
    mode: 'stacked',
    orientation: 'horizontal',
    series: OUTCOME_SERIES,
    categoryTickSize: 32,
    valueTicks: [0, 0.25, 0.5, 0.75, 1],
  },
};
