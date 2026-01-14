import type { Meta, StoryObj } from '@storybook/react';

import { ControlledValueStory } from './stories/ControlledValueStory';
import { UserOption } from './stories/UserOption';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
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
    className: { table: { disable: true } },
    clearable: {
      control: 'boolean',
      description: 'Enable clear button.',
      table: { category: 'Behavior' },
    },
    defaultValue: { table: { disable: true } },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled.',
      table: { category: 'Behavior' },
    },
    onChange: { table: { disable: true } },
    value: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  name: 'Text',
  args: {
    clearable: true,
    disabled: false,
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'raspberry', label: 'Raspberry', disabled: true },
      { value: 'elderberry', label: 'Elderberry' },
    ],
    placeholder: 'Select a fruit...',
  },
};

export const Numeric: Story = {
  name: 'Numeric',
  args: {
    clearable: true,
    disabled: false,
    options: [
      { value: 1, label: 'Critical' },
      { value: 2, label: 'High' },
      { value: 3, label: 'Medium' },
      { value: 4, label: 'Low' },
      { value: 5, label: 'None' },
    ],
    placeholder: 'Select priority...',
  },
};

export const CustomItemComponents: Story = {
  name: 'Custom Item Components',
  args: {
    clearable: true,
    disabled: false,
    options: [
      {
        value: '7b90a423-1979-4e61-a30b-b19d663b3e43',
        label: <UserOption user={{ name: 'Alice A.' }} />,
      },
      {
        value: 'fb48b2c8-8bad-4a5f-88df-1cb3170eeec5',
        label: <UserOption user={{ name: 'Bob B.' }} />,
      },
      {
        value: '56b0668e-5664-4418-be4d-49f0a04a59a2',
        label: <UserOption user={{ name: 'Charlie C.' }} />,
      },
    ],
    placeholder: <UserOption placeholder="Select a user..." />,
  },
};

export const ControlledValue: Story = {
  name: 'Controlled Value',
  argTypes: {
    options: { table: { disable: true } },
    placeholder: { table: { disable: true } },
  },
  args: {
    clearable: false,
    disabled: false,
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'raspberry', label: 'Raspberry', disabled: true },
      { value: 'elderberry', label: 'Elderberry' },
    ],
  },
  render: (args) => <ControlledValueStory {...args} />,
};

export const ManyItems: Story = {
  name: 'Many (200+) Items',
  args: {
    clearable: true,
    disabled: false,
    options: Array.from({ length: 200 }, (_, i) => ({
      value: i + 1,
      label: `Item ${i + 1}`,
    })),
    placeholder: 'Select an item...',
  },
};
