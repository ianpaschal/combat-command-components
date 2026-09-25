import type { Meta, StoryObj } from '@storybook/react';

import { InputTextArea } from './InputTextArea';

const meta: Meta<typeof InputTextArea> = {
  title: 'Components/InputTextArea',
  component: InputTextArea,
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
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'warning', 'success', 'info'],
      description: 'The color of the input.',
      table: { category: 'Appearance' },
    },
    variant: {
      control: 'select',
      options: ['solid', 'shaded', 'ghost', 'surface'],
      description: 'The variant of the input.',
      table: { category: 'Appearance' },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled.',
      table: { category: 'Behavior' },
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
    placeholder: 'Enter your notes...',
    variant: 'ghost',
  },
};
