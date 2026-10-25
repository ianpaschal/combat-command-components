import type { Meta, StoryObj } from '@storybook/react';
import { Home } from 'lucide-react';

import { Breadcrumbs } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    items: {
      control: 'object',
      description: 'The trail of pages. The last item is treated as the current page.',
      table: { category: 'Content' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    items: [
      { label: 'Blog', href: '/blog' },
      { label: 'Release' },
    ],
  },
};

export const Nested: Story = {
  name: 'Nested',
  args: {
    items: [
      { label: 'Docs', href: '/docs' },
      { label: 'Guides', href: '/docs/guides' },
      { label: 'Tournament Setup' },
    ],
  },
};

export const WithIcon: Story = {
  name: 'With Icon',
  args: {
    items: [
      { label: <Home />, href: '/' },
      { label: 'Docs', href: '/docs' },
      { label: 'Tournament Setup' },
    ],
  },
};
