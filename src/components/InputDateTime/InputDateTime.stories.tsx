import type { Meta, StoryObj } from '@storybook/react';

import { ControlledStory } from './stories/ControlledStory';
import { InputDateTime } from './InputDateTime';

const meta: Meta<typeof InputDateTime> = {
  title: 'Components/InputDateTime',
  component: InputDateTime,
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
    minuteStep: {
      control: { type: 'number', min: 1, max: 60 },
      description: 'Interval in minutes between selectable minute values.',
      table: { category: 'Behavior' },
    },
    mobile: {
      control: 'boolean',
      description: 'Renders a bottom drawer instead of an anchored popover.',
      table: { category: 'Behavior' },
    },
    onChange: { table: { disable: true } },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown when no value is selected.',
      table: { category: 'Display' },
    },
    secondStep: {
      control: { type: 'number', min: 1, max: 60 },
      description: 'Interval in seconds between selectable second values.',
      table: { category: 'Behavior' },
    },
    value: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default (Popover)',
  args: {
    disabled: false,
    minuteStep: 15,
    mobile: false,
    placeholder: 'Pick a date & time',
    secondStep: 60,
  },
};

export const Mobile: Story = {
  name: 'Mobile (Drawer)',
  args: {
    disabled: false,
    minuteStep: 15,
    mobile: true,
    placeholder: 'Pick a date & time',
    secondStep: 60,
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    disabled: true,
    minuteStep: 15,
    mobile: false,
    placeholder: 'Pick a date & time',
    secondStep: 60,
  },
};

export const Controlled: Story = {
  name: 'Controlled',
  args: {
    disabled: false,
    minuteStep: 5,
    mobile: false,
    placeholder: 'Pick a date & time',
    secondStep: 60,
  },
  render: (args) => <ControlledStory {...args} />,
};

export const Clearable: Story = {
  name: 'Clearable',
  args: {
    clearable: true,
    disabled: false,
    minuteStep: 15,
    mobile: false,
    placeholder: 'Pick a date & time',
    secondStep: 60,
  },
  render: (args) => <ControlledStory {...args} />,
};
