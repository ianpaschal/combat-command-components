import type { Meta, StoryObj } from '@storybook/react';

import {
  ChartLine,
  ChartLineDatum,
  ChartLineSeries,
} from './ChartLine';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const GAMES_SERIES: ChartLineSeries[] = [
  { key: 'games', color: '#0090FF', label: 'Games' },
];

const OUTCOME_SERIES: ChartLineSeries[] = [
  { key: 'win', color: '#0090FF', label: 'Wins' },
  { key: 'draw', color: '#8B8D98', label: 'Draws' },
  { key: 'loss', color: '#F76B15', label: 'Losses' },
];

const getX = (i: number): string => `${MONTHS[i % MONTHS.length]} ${Math.floor(i / MONTHS.length) + 1}`;

const getGames = (i: number, phase = 0): number => (
  Math.max(0, Math.round(40 + i * 1.5 + (Math.sin(i * 0.9 + phase) + Math.sin(i * 0.37) * 0.6) * 20))
);

const getData = (count: number): ChartLineDatum[] => (
  Array.from({ length: count }, (_, i) => ({ x: getX(i), values: { games: getGames(i) } }))
);

const getOutcomeData = (count: number): ChartLineDatum[] => (
  Array.from({ length: count }, (_, i) => ({
    x: getX(i),
    values: {
      win: Math.round(getGames(i) * 0.45),
      draw: Math.round(getGames(i, 2) * 0.1),
      loss: Math.round(getGames(i, 4) * 0.45),
    },
  }))
);

const meta: Meta<typeof ChartLine> = {
  title: 'Charts/ChartLine',
  component: ChartLine,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A value changing along an ordered x axis, such as time. Drag the corner of the box to resize it.',
      },
    },
  },
  argTypes: {
    axisPadding: { control: 'number' },
    categoryTickSize: { control: 'number' },
    className: { table: { disable: true } },
    data: { control: 'object' },
    edgeLabels: { control: 'inline-radio', options: ['shift', 'center'] },
    formatCategory: { table: { disable: true } },
    formatValue: { table: { disable: true } },
    mode: { control: 'inline-radio', options: ['overlaid', 'stacked'] },
    padding: { control: 'number' },
    paddingX: { control: 'number' },
    paddingY: { control: 'number' },
    paddingTop: { control: 'number' },
    paddingRight: { control: 'number' },
    paddingBottom: { control: 'number' },
    paddingLeft: { control: 'number' },
    scrollToEnd: { control: 'boolean' },
    series: { control: 'object' },
    valueTickSize: { control: 'number' },
    xAxisPosition: { control: 'inline-radio', options: ['top', 'bottom', 'both'] },
    yAxisPosition: { control: 'inline-radio', options: ['left', 'right', 'both'] },
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
    data: getData(12),
    series: GAMES_SERIES,
  },
};

export const FixedSize: Story = {
  args: {
    data: getData(36),
    series: GAMES_SERIES,
    categoryTickSize: 48,
  },
};

export const Overlaid: Story = {
  args: {
    data: getOutcomeData(12),
    series: OUTCOME_SERIES,
  },
};

export const Stacked: Story = {
  args: {
    data: getOutcomeData(12),
    mode: 'stacked',
    series: OUTCOME_SERIES,
  },
};
