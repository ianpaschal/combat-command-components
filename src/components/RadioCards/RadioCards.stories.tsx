import type { Meta, StoryObj } from '@storybook/react';

import { RadioCards } from './RadioCards';

const meta: Meta<typeof RadioCards> = {
  title: 'Components/RadioCards',
  component: RadioCards,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
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
    options: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    disabled: false,
    border: true,
    options: [
      {
        value: 'llama',
        label: 'Llama 3 (8B)',
        description: 'High quality responses with good performance',
      },
      {
        value: 'gemma',
        label: 'Gemma 2 (9B)',
        description: 'Excellent quality for complex tasks',
      },
      {
        value: 'mistral',
        label: 'Mistral 7B',
        description: 'Faster alternative with good quality',
      },
    ],
    defaultValue: 'llama',
  },
};
