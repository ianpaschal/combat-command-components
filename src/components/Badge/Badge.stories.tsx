import type { Meta, StoryObj } from '@storybook/react';
import { Mail } from 'lucide-react';

import { Button } from '../Button';
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
    color: {
      control: 'radio',
      options: [
        'accent',
        'neutral',
        'red',
        'yellow',
        'green',
        'blue',
      ],
      description: 'The color for the badge.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithNumber: Story = {
  args: {
    value: '5',
    color: 'red',
    children: <Button icon={<Mail />} variant="shaded" />,
  },
};

export const WithText: Story = {
  args: {
    value: 'New',
    color: 'blue',
    children: <Button text="Notifications" variant="shaded" />,
  },
};
