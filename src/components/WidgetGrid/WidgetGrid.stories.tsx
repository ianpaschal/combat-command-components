import type { Meta, StoryObj } from '@storybook/react';

import { Widget } from './components/Widget';
import { WidgetGrid, WidgetGridProps } from './WidgetGrid';

type WidgetGridStoryArgs = WidgetGridProps & {
  glass: boolean;
};

const meta: Meta<WidgetGridStoryArgs> = {
  title: 'Components/WidgetGrid',
  component: WidgetGrid,
  tags: ['autodocs'],
  argTypes: {
    gap: { control: 'number' },
  },
  parameters: {
    bodyBackground: 'var(--color-page-bg)',
  },
};

export default meta;
type Story = StoryObj<WidgetGridStoryArgs>;

export const Default: Story = {
  args: {
    columns: { 0: 2, 656: 4, 992: 6 },
    gap: 16,
    glass: false,
  },
  render: ({ glass, ...args }) => (
    <WidgetGrid {...args}>
      <Widget
        glass={glass}
        positions={{
          2: { from: [0, 0], to: [1, 1] },
          4: { from: [0, 0], to: [1, 1] },
          6: { from: [0, 0], to: [1, 1] },
        }}
      />
      <Widget
        glass={glass}
        positions={{
          2: { from: [1, 0], to: [2, 1] },
          4: { from: [0, 1], to: [1, 2] },
          6: { from: [0, 1], to: [1, 2] },
        }}
      />
      <Widget
        glass={glass}
        positions={{
          2: { from: [0, 1], to: [2, 3] },
          4: { from: [1, 0], to: [3, 2] },
          6: { from: [1, 0], to: [3, 2] },
        }}
      />
      <Widget
        glass={glass}
        positions={{
          2: { from: [0, 3], to: [2, 4] },
          4: { from: [3, 0], to: [4, 2] },
          6: { from: [3, 0], to: [6, 2] },
        }}
      />
    </WidgetGrid>
  ),
};
