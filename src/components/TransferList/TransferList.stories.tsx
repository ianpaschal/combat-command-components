import type { Meta, StoryObj } from '@storybook/react';

import { ControlledStory } from '../../utils/stories/ControlledStory';
import { UserOption } from '../Select/stories/UserOption';
import { TransferList } from './TransferList';

const meta: Meta<typeof TransferList> = {
  title: 'Components/TransferList',
  component: TransferList,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 560 }}>
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
    batch: {
      control: 'boolean',
      description: 'Renders checkboxes and center arrow buttons for moving multiple items at once, instead of moving items on click.',
      table: { category: 'Behavior' },
    },
    availableLabel: {
      control: 'text',
      description: 'The label for the available (left) pane.',
      table: { category: 'Content' },
    },
    selectedLabel: {
      control: 'text',
      description: 'The label for the selected (right) pane.',
      table: { category: 'Content' },
    },
    searchPlaceholder: {
      control: 'text',
      description: 'The placeholder text for each pane\'s search input.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
    options: { table: { disable: true } },
    renderItem: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const fruitOptions = [
  'Apple',
  'Apricot',
  'Banana',
  'Blackberry',
  'Blueberry',
  'Cantaloupe',
  'Cherry',
  'Clementine',
  'Coconut',
  'Cranberry',
  'Date',
  'Dragonfruit',
  'Durian',
  'Elderberry',
  'Fig',
  'Grape',
  'Grapefruit',
  'Guava',
  'Honeydew',
  'Jackfruit',
  'Kiwi',
  'Kumquat',
  'Lemon',
  'Lime',
  'Lychee',
  'Mandarin',
  'Mango',
  'Mulberry',
  'Nectarine',
  'Orange',
  'Papaya',
  'Peach',
  'Pear',
  'Persimmon',
  'Pineapple',
  'Plum',
  'Pomegranate',
  'Quince',
  'Raspberry',
  'Star Fruit',
  'Strawberry',
  'Tangerine',
  'Watermelon',
].map((label) => ({ value: label.toLowerCase().replace(/\s+/g, '-'), label }));

export const Default: Story = {
  name: 'Default',
  args: {
    disabled: false,
    batch: false,
    options: fruitOptions,
    defaultValue: ['banana', 'fig', 'mango', 'pear', 'watermelon'],
  },
};

export const Batch: Story = {
  name: 'Batch',
  args: {
    disabled: false,
    batch: true,
    options: fruitOptions,
    defaultValue: ['banana', 'fig', 'mango', 'pear', 'watermelon'],
  },
};

const userOptions = [
  'Alice A.',
  'Bob B.',
  'Charlie C.',
  'Dana D.',
  'Eve E.',
  'Frank F.',
  'Grace G.',
  'Heidi H.',
].map((name) => ({
  value: name.toLowerCase().replace(/\W+/g, '-'),
  label: name,
}));

export const CustomItems: Story = {
  name: 'Custom Items',
  args: {
    disabled: false,
    batch: false,
    options: userOptions,
    defaultValue: ['bob-b-', 'eve-e-'],
    availableLabel: 'Users',
    selectedLabel: 'Invited',
    searchPlaceholder: 'Search users...',
    renderItem: (item) => (
      <UserOption user={{ name: `${item.label}` }} />
    ),
  },
};

export const Controlled: Story = {
  name: 'Controlled',
  args: {
    disabled: false,
    batch: false,
  },
  render: (args) => (
    <ControlledStory
      component={TransferList}
      props={{ ...args, options: fruitOptions }}
      initialValue={['cherry', 'kiwi', 'papaya']}
      renderValue={(value) => (value.length ? value.join(', ') : 'none')}
      actions={[
        { label: 'Select Cherry, Kiwi, Papaya', value: ['cherry', 'kiwi', 'papaya'] },
        { label: 'Clear', value: [] },
      ]}
    />
  ),
};
