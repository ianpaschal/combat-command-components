import type { Meta, StoryObj } from '@storybook/react';
import { Timer } from 'lucide-react';

import { ControlledStory } from './stories/ControlledStory';
import { InputDuration } from './InputDuration';

const meta: Meta<typeof InputDuration> = {
  title: 'Inputs/InputDuration',
  component: InputDuration,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    border: {
      control: 'boolean',
      description: 'Whether the input has a border.',
      table: { category: 'Appearance' },
    },
    defaultValue: { table: { disable: true } },
    icon: { table: { disable: true } },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled.',
      table: { category: 'Behavior' },
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'warning', 'success', 'info'],
      description: 'The color of the input.',
      table: { category: 'Appearance' },
    },
    maxUnit: {
      control: 'select',
      options: ['m', 'h', 'd', 'w'],
      description: 'The largest unit shown. It has no upper limit.',
      table: { category: 'Behavior' },
    },
    minUnit: {
      control: 'select',
      options: ['s', 'm', 'h', 'd'],
      description: 'The smallest unit shown, and what the last typed digit means.',
      table: { category: 'Behavior' },
    },
    onChange: { table: { disable: true } },
    step: {
      control: { type: 'number', min: 1 },
      description: 'How many of the smallest unit the arrow keys change the value by.',
      table: { category: 'Behavior' },
    },
    value: { table: { disable: true } },
    variant: {
      control: 'select',
      options: ['solid', 'shaded', 'ghost', 'surface'],
      description: 'The variant of the input.',
      table: { category: 'Appearance' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    border: true,
    disabled: false,
    intent: 'secondary',
    maxUnit: 'h',
    minUnit: 'm',
    step: 1,
    variant: 'ghost',
  },
  render: (args) => <ControlledStory {...args} />,
};

export const WithSeconds: Story = {
  name: 'With Seconds',
  args: {
    ...Default.args,
    minUnit: 's',
  },
  render: (args) => <ControlledStory {...args} />,
};

export const MinutesOnly: Story = {
  name: 'Minutes Only',
  args: {
    ...Default.args,
    maxUnit: 'm',
  },
  render: (args) => <ControlledStory {...args} />,
};

export const WithIcon: Story = {
  name: 'With Icon',
  args: {
    ...Default.args,
    icon: <Timer />,
  },
  render: (args) => <ControlledStory {...args} />,
};

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    ...Default.args,
    disabled: true,
  },
  render: (args) => <ControlledStory {...args} />,
};
