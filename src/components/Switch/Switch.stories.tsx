import type { Meta, StoryObj } from '@storybook/react';

import { ELEMENT_INTENTS } from '../../types';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled.',
    },
    intent: {
      control: 'select',
      options: ELEMENT_INTENTS,
      description: 'The color of the switch when checked.',
    },
    onChange: { table: { disable: true } },
  },
};

const noControls = {
  className: { control: false },
  defaultValue: { control: false },
  name: { control: false },
  value: { control: false },
} as const;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    disabled: false,
    intent: 'primary',
  },
  argTypes: noControls,
};
