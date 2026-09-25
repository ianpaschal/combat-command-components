import type { Meta, StoryObj } from '@storybook/react';
import { Search } from 'lucide-react';

import { InputText } from './InputText';

const meta: Meta<typeof InputText> = {
  title: 'Components/InputText',
  component: InputText,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    border: {
      control: 'boolean',
      description: 'Whether the input has a border.',
      table: { category: 'Appearance' },
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'warning', 'success', 'info'],
      description: 'The color of the input.',
      table: { category: 'Appearance' },
    },
    variant: {
      control: 'select',
      options: ['solid', 'shaded', 'ghost', 'surface'],
      description: 'The variant of the input.',
      table: { category: 'Appearance' },
    },
    corners: {
      control: 'select',
      options: ['tight', 'normal', 'wide'],
      description: 'The corner radius of the input.',
      table: { category: 'Appearance' },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled.',
      table: { category: 'Behavior' },
    },
    icon: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    border: true,
    corners: 'normal',
    disabled: false,
    intent: 'secondary',
    placeholder: 'Enter your name...',
    variant: 'ghost',
  },
};

export const WithIcon: Story = {
  name: 'With Icon',
  args: {
    border: true,
    corners: 'normal',
    disabled: false,
    intent: 'secondary',
    placeholder: 'Search...',
    icon: <Search />,
    variant: 'ghost',
  },
};
