import type { Meta, StoryObj } from '@storybook/react';

import { RatioBar } from './RatioBar';

const meta: Meta<typeof RatioBar> = {
  title: 'Components/RatioBar',
  component: RatioBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sections: [
      { value: 3, color: '#4ade80', label: 'Wins' },
      { value: 1, color: '#facc15', label: 'Draws' },
      { value: 2, color: '#f87171', label: 'Losses' },
    ],
  },
};
