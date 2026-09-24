import type { Meta, StoryObj } from '@storybook/react';
import {
  Mail,
  Plus,
  Upload,
} from 'lucide-react';

import { ButtonStoryWrapper } from './stories/ButtonStoryWrapper';
import { Button } from './Button';
import { FileInputButton } from './FileInputButton';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    text: {
      control: 'text',
      description: 'The text content of the button.',
      table: { category: 'Content' },
    },
    icon: {
      control: false,
      table: { disable: true },
    },
    iconPosition: {
      control: 'radio',
      options: ['start', 'end'],
      description: 'The position of the icon relative to the text.',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outlined', 'ghost'],
      description: 'The variant of the button.',
      table: { category: 'Appearance' },
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'warning', 'success', 'info'],
      description: 'The color of the button.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
      description: 'The size of the button.',
      table: { category: 'Appearance' },
    },
    border: {
      control: 'boolean',
      description: 'Whether the button has a visible border.',
      table: { category: 'Appearance' },
    },
    corners: {
      control: 'select',
      options: ['tight', 'normal', 'wide'],
      description: 'The corner radius of the button.',
      table: { category: 'Appearance' },
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the button has rounded ends.',
      table: { category: 'Appearance' },
    },
    collapsePadding: {
      control: 'boolean',
      description: 'Whether to collapse the padding of the button.',
      table: { category: 'Appearance' },
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state.',
      table: { category: 'State' },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled.',
      table: { category: 'State' },
    },
    href: {
      control: 'text',
      description: 'When provided, renders the button as an anchor element.',
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
    collapsePadding: false,
    corners: 'normal',
    disabled: false,
    icon: undefined,
    iconPosition: undefined,
    intent: 'secondary',
    loading: false,
    rounded: false,
    size: 'normal',
    text: 'Add Item',
    variant: 'solid',
  },
};

export const TextIcon: Story = {
  name: 'Text & Icon',
  args: {
    border: false,
    collapsePadding: false,
    corners: 'normal',
    disabled: false,
    icon: <Plus />,
    iconPosition: 'start',
    intent: 'secondary',
    loading: false,
    rounded: false,
    size: 'normal',
    text: 'Add Item',
    variant: 'solid',
  },
};

export const Icon: Story = {
  name: 'Icon',
  args: {
    border: false,
    collapsePadding: false,
    corners: 'normal',
    disabled: false,
    icon: <Mail />,
    iconPosition: 'start',
    intent: 'secondary',
    loading: false,
    rounded: false,
    size: 'normal',
    variant: 'solid',
  },
};

export const Link: Story = {
  name: 'Link',
  args: {
    border: false,
    collapsePadding: false,
    corners: 'normal',
    href: 'https://example.com',
    intent: 'secondary',
    rounded: false,
    size: 'normal',
    target: '_blank',
    text: 'Visit Site',
    variant: 'solid',
  },
};

export const VisualComparison: Story = {
  name: 'Visual Comparison',
  args: {
    text: 'Add Item',
    icon: <Plus />,
    iconPosition: 'start',
    size: 'normal',
    collapsePadding: false,
    corners: 'normal',
    loading: false,
    disabled: false,
    rounded: false,
  },
  argTypes: {
    variant: {
      control: false,
      table: { disable: true },
    },
    intent: {
      control: false,
      table: { disable: true },
    },
    icon: {
      control: false,
      table: { disable: true },
    },
  },
  render: (args) => <ButtonStoryWrapper {...args} />,
};

export const FileInput: StoryObj<typeof FileInputButton> = {
  name: 'File Input',
  args: {
    accept: ['.pdf', '.png', '.jpg'],
    collapsePadding: false,
    corners: 'normal',
    disabled: false,
    icon: <Upload />,
    iconPosition: 'start',
    intent: 'secondary',
    loading: false,
    rounded: false,
    size: 'normal',
    text: 'Upload File',
    variant: 'solid',
  },
  render: (args) => <FileInputButton {...args} />,
};
