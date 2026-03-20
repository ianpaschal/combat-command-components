import type { Meta, StoryObj } from '@storybook/react';

import { InteractiveStory } from './stories/InteractiveStory';
import { randomPicsumUrl } from './stories/InteractiveStory.utils';
import { ImageViewer } from './ImageViewer';

const meta: Meta<typeof ImageViewer> = {
  title: 'Components/ImageViewer',
  component: ImageViewer,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
  },
  tags: ['autodocs'],
  argTypes: {
    url: {
      control: 'text',
      description: 'The URL of the image to display.',
      table: { category: 'Content' },
    },
    alt: {
      control: 'text',
      description: 'Alt text for the image.',
      table: { category: 'Content' },
    },
    loading: {
      control: 'boolean',
      description: 'Force the loading spinner to show regardless of image state.',
      table: { category: 'Behavior' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    url: randomPicsumUrl(),
    alt: 'A random image',
    loading: false,
  },
  render: (args) => <InteractiveStory {...args} />,
};
