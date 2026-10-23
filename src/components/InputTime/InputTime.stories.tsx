import type { Meta, StoryObj } from '@storybook/react';

import { ControlledStory } from './stories/ControlledStory';
import { InputTime } from './InputTime';

const meta: Meta<typeof InputTime> = {
  title: 'Inputs/InputTime',
  component: InputTime,
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
    defaultValue: { table: { disable: true } },
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
    minUnit: {
      control: 'select',
      options: ['h', 'm', 's'],
      description: 'The smallest unit which can be chosen. Smaller units are set to zero.',
      table: { category: 'Behavior' },
    },
    variant: {
      control: 'select',
      options: ['solid', 'shaded', 'ghost', 'surface'],
      description: 'The variant of the input.',
      table: { category: 'Appearance' },
    },
    onChange: { table: { disable: true } },
    value: { table: { disable: true } },
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
    minUnit: 'm',
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

export const HoursOnly: Story = {
  name: 'Hours Only',
  args: {
    ...Default.args,
    minUnit: 'h',
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
