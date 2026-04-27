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
    disabled: false,
    placeholder: 'Enter your notes...',
  },
};
