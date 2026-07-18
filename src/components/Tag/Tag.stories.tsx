import type { Meta, StoryObj } from '@storybook/react';
import { Star } from 'lucide-react';

import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    text: {
      control: 'text',
      description: 'The text content of the tag.',
      table: { category: 'Content' },
    },
    icon: {
      control: false,
      table: { disable: true },
    },
    variant: {
      control: 'select',
      options: ['solid', 'shaded', 'ghost', 'surface'],
      description: 'The variant of the tag.',
      table: { category: 'Appearance' },
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'warning', 'success', 'info'],
      description: 'The color of the tag.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
      description: 'The size of the tag.',
      table: { category: 'Appearance' },
    },
    border: {
      control: 'boolean',
      description: 'Whether the tag has a visible border.',
      table: { category: 'Appearance' },
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the tag has rounded ends.',
      table: { category: 'Appearance' },
    },
    corners: {
      control: 'select',
      options: ['tight', 'normal', 'wide'],
      description: 'The corner radius of the tag.',
      table: { category: 'Appearance' },
    },
    href: {
      control: 'text',
      description: 'When provided, renders the tag as an anchor element.',
      table: { category: 'Link' },
    },
    target: {
      control: 'text',
      description: 'The target attribute for the anchor element.',
      table: { category: 'Link' },
    },
    rel: {
      control: 'text',
      description: 'The rel attribute for the anchor element.',
      table: { category: 'Link' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  name: 'Text',
  args: {
    border: false,
    corners: 'normal',
    icon: undefined,
    intent: 'secondary',
    rounded: false,
    size: 'normal',
    text: 'Beginner',
    variant: 'shaded',
  },
};

export const TextIcon: Story = {
  name: 'Text & Icon',
  args: {
    border: false,
    corners: 'normal',
    icon: <Star />,
    intent: 'secondary',
    rounded: false,
    size: 'normal',
    text: 'Featured',
    variant: 'shaded',
  },
};

export const Clickable: Story = {
  name: 'Clickable',
  args: {
    border: false,
    corners: 'normal',
    intent: 'secondary',
    onClick: () => undefined,
    rounded: false,
    size: 'normal',
    text: 'Category',
    variant: 'shaded',
  },
};

export const Link: Story = {
  name: 'Link',
  args: {
    border: false,
    corners: 'normal',
    href: 'https://example.com',
    intent: 'secondary',
    rounded: false,
    size: 'normal',
    target: '_blank',
    text: 'Category',
    variant: 'shaded',
  },
};

export const Removable: Story = {
  name: 'Removable',
  args: {
    border: false,
    corners: 'normal',
    intent: 'secondary',
    onRemove: () => undefined,
    rounded: false,
    size: 'normal',
    text: 'Filter',
    variant: 'shaded',
  },
};
