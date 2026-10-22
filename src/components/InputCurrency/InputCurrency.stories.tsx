import type { Meta, StoryObj } from '@storybook/react';

import { ControlledStory } from './stories/ControlledStory';
import { InputCurrency } from './InputCurrency';

const meta: Meta<typeof InputCurrency> = {
  title: 'Inputs/InputCurrency',
  component: InputCurrency,
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
    currencies: { table: { disable: true } },
    decimals: {
      control: { type: 'number', min: 0, max: 4 },
      description: 'How many digits are after the separator. Use 0 for currencies without a fraction.',
      table: { category: 'Behavior' },
    },
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
    onChange: { table: { disable: true } },
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
    decimals: 2,
    disabled: false,
    intent: 'secondary',
    variant: 'ghost',
  },
  render: (args) => <ControlledStory {...args} />,
};

export const NoDecimals: Story = {
  name: 'No Decimals',
  args: {
    ...Default.args,
    decimals: 0,
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
