import type { Meta, StoryObj } from '@storybook/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
} from 'lucide-react';

import { ToggleGroup } from './ToggleGroup';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    activeVariant: {
      control: 'select',
      options: ['solid', 'shaded', 'ghost', 'surface'],
      description: 'The variant applied to pressed items.',
      table: { category: 'Appearance' },
    },
    variant: {
      control: 'select',
      options: ['solid', 'shaded', 'ghost', 'surface'],
      description: 'The variant applied to unpressed items.',
      table: { category: 'Appearance' },
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'warning', 'success', 'info'],
      description: 'The color of items.',
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['small', 'normal', 'large'],
      description: 'The size of each item.',
      table: { category: 'Appearance' },
    },
    border: {
      control: 'boolean',
      description: 'Whether the group has a visible border.',
      table: { category: 'Appearance' },
    },
    corners: {
      control: 'select',
      options: ['tight', 'normal', 'wide'],
      description: 'The corner radius of each item.',
      table: { category: 'Appearance' },
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the group has rounded ends.',
      table: { category: 'Appearance' },
    },
    equal: {
      control: 'boolean',
      description: 'Whether all items are forced to an equal size.',
      table: { category: 'Appearance' },
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the group.',
      table: { category: 'Appearance' },
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple items can be pressed at once.',
      table: { category: 'Behavior' },
    },
    loopFocus: {
      control: 'boolean',
      description: 'Whether arrow-key navigation wraps from the last item to the first, and vice versa.',
      table: { category: 'Behavior' },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the group is disabled.',
      table: { category: 'State' },
    },
    defaultValue: { table: { disable: true } },
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sharedArgs = {
  activeVariant: 'shaded',
  border: true,
  corners: 'normal',
  disabled: false,
  equal: false,
  intent: 'secondary',
  loopFocus: true,
  multiple: false,
  orientation: 'horizontal',
  rounded: false,
  size: 'normal',
  variant: 'ghost',
} as const;

export const Text: Story = {
  name: 'Text',
  args: {
    ...sharedArgs,
    options: [
      { value: 'system', text: 'System' },
      { value: 'light', text: 'Light' },
      { value: 'dark', text: 'Dark' },
    ],
    defaultValue: ['system'],
  },
};

export const TextIcon: Story = {
  name: 'Text & Icon',
  args: {
    ...sharedArgs,
    options: [
      { value: 'left', text: 'Left', icon: <AlignLeft /> },
      { value: 'center', text: 'Center', icon: <AlignCenter /> },
      { value: 'right', text: 'Right', icon: <AlignRight /> },
    ],
    defaultValue: ['left'],
  },
};

export const Icon: Story = {
  name: 'Icon',
  args: {
    ...sharedArgs,
    options: [
      { value: 'left', icon: <AlignLeft />, ariaLabel: 'Align left' },
      { value: 'center', icon: <AlignCenter />, ariaLabel: 'Align center' },
      { value: 'right', icon: <AlignRight />, ariaLabel: 'Align right' },
    ],
    defaultValue: ['left'],
  },
};
