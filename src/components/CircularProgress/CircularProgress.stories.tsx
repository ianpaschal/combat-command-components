import type { Meta, StoryObj } from '@storybook/react';

import { THEME_COLORS } from '../../types';
import { CircularProgress } from './CircularProgress';

const meta: Meta<typeof CircularProgress> = {
  title: 'Components/CircularProgress',
  component: CircularProgress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Progress value from 0 to 1.',
      table: { category: 'Appearance' },
    },
    trackWidth: {
      control: 'number',
      description: 'Arc thickness in pixels.',
      table: { category: 'Appearance' },
    },
    color: {
      control: 'select',
      options: THEME_COLORS,
      description: 'Arc fill color.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'number',
      description: 'Fixed pixel size. Omit to fill container.',
      table: { category: 'Appearance' },
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: { value: 0.75, size: 128, trackWidth: 8 },
  render: (args) => (
    <CircularProgress {...args}>
      <span style={{ fontSize: 14 }}>{Math.round(args.value * 100)}%</span>
    </CircularProgress>
  ),
};
