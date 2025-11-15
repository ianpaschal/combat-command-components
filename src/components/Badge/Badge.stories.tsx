import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    children: { table: { disable: true } },
    value: {
      control: 'text',
      description: 'The value to display (number or string).',
    },
    intent: {
      control: 'radio',
      options: [
        'default',
        'danger',
        'warning',
        'success',
        'info',
      ],
      description: 'The intent (color) for the badge.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithNumber: Story = {
  args: {
    value: '5',
    intent: 'danger',
    children: <button>Notifications</button>,
  },
};

export const WithText: Story = {
  args: {
    value: 'New',
    intent: 'info',
    children: <button>Notifications</button>,
  },
};
