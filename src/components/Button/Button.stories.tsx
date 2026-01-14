import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Plus } from 'lucide-react';

import { ButtonStoryWrapper } from './stories/ButtonStoryWrapper';
import { Button } from './Button';

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
      options: ['neutral', 'danger', 'warning', 'success', 'info'],
      description: 'The color of the button.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
      description: 'The size of the button.',
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  name: 'Text',
  args: {
    collapsePadding: false,
    disabled: false,
    icon: undefined,
    iconPosition: undefined,
    intent: 'neutral',
    loading: false,
    rounded: false,
    size: 'normal',
    text: 'Add Item',
    variant: 'primary',
  },
};

export const TextIcon: Story = {
  name: 'Text & Icon',
  args: {
    collapsePadding: false,
    disabled: false,
    icon: <Plus />,
    iconPosition: 'start',
    intent: 'neutral',
    loading: false,
    rounded: false,
    size: 'normal',
    text: 'Add Item',
    variant: 'primary',
  },
};

export const Icon: Story = {
  name: 'Icon',
  args: {
    collapsePadding: false,
    disabled: false,
    icon: <Mail />,
    iconPosition: 'start',
    intent: 'neutral',
    loading: false,
    rounded: false,
    size: 'normal',
    variant: 'primary',
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
