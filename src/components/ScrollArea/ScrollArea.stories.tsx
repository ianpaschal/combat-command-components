import type { Meta, StoryObj } from '@storybook/react';

import { longContent } from '../../fixtures';
import { ScrollArea } from './ScrollArea';

type StoryArgs = { topOffset: number; bottomOffset: number };

const meta: Meta<StoryArgs> = {
  title: 'Components/ScrollArea',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    topOffset: { control: { type: 'range', min: 0, max: 100, step: 4 } },
    bottomOffset: { control: { type: 'range', min: 0, max: 100, step: 4 } },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  name: 'Default',
  args: {
    topOffset: 0,
    bottomOffset: 0,
  },
  render: ({ topOffset, bottomOffset }) => (
    <ScrollArea style={{ height: 300, width: 400 }} offset={{ top: topOffset, bottom: bottomOffset }}>
      {longContent}
    </ScrollArea>
  ),
};
