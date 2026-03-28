import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    bodyBackground: 'var(--color-page-bg)',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    children: { table: { disable: true } },
    elevation: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <p style={{ margin: 0 }}>Card content goes here.</p>,
  },
};
