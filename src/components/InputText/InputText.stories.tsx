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
    corners: 'normal',
    disabled: false,
    placeholder: 'Enter your name...',
  },
};

export const WithIcon: Story = {
  name: 'With Icon',
  args: {
    corners: 'normal',
    disabled: false,
    placeholder: 'Search...',
    icon: <Search />,
  },
};
