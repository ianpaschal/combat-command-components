import type { Meta, StoryObj } from '@storybook/react';

import { CheckboxGroup } from './CheckboxGroup';

const meta: Meta<typeof CheckboxGroup> = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
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
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled.',
      table: { category: 'Behavior' },
    },
    options: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    disabled: false,
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
    defaultValue: ['apple'],
  },
};

export const WithDescriptions: Story = {
  name: 'With Descriptions',
  args: {
    disabled: false,
    options: [
      { value: 'apple', label: 'Apple', description: 'A crisp red fruit' },
      { value: 'banana', label: 'Banana', description: 'A yellow tropical fruit' },
      { value: 'cherry', label: 'Cherry', description: 'A small sweet stone fruit' },
    ],
    defaultValue: ['banana'],
  },
};
