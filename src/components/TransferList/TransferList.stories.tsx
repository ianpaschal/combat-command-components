import type { Meta, StoryObj } from '@storybook/react';

import { ControlledStory } from '../../utils/stories/ControlledStory';
import { UserOption } from '../Select/stories/UserOption';
import { TransferList, TransferListProps } from './TransferList';
import { TransferListValue } from './TransferList.types';

const meta: Meta<typeof TransferList> = {
  title: 'Components/TransferList',
  component: TransferList,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story, { args }) => (
      <div style={{ width: args.orientation === 'vertical' ? 320 : 560 }}>
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
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Whether the groups are laid out side by side or stacked.',
      table: { category: 'Appearance' },
    },
    searchPlaceholder: {
      control: 'text',
      description: 'The placeholder text for each pane\'s search input.',
      table: { category: 'Content' },
    },
    className: { table: { disable: true } },
    groups: { table: { disable: true } },
    items: { table: { disable: true } },
    renderItem: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const fruitItems = [
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

const twoGroups = [
  { key: 'available', title: 'Available' },
  { key: 'selected', title: 'Selected' },
];

const threeGroups = [
  { key: 'available', title: 'Available' },
  { key: 'shortlist', title: 'Shortlist' },
  { key: 'selected', title: 'Selected' },
];

export const Default: Story = {
  name: 'Default',
  args: {
    disabled: false,
    orientation: 'horizontal',
    groups: twoGroups,
    items: fruitItems,
    defaultValue: {
      selected: ['banana', 'fig', 'mango', 'pear', 'watermelon'],
    },
  },
};

export const Vertical: Story = {
  name: 'Vertical',
  args: {
    disabled: false,
    orientation: 'vertical',
    groups: twoGroups,
    items: fruitItems,
    defaultValue: {
      selected: ['banana', 'fig', 'mango', 'pear', 'watermelon'],
    },
  },
};

export const ThreeLists: Story = {
  name: 'Three Lists',
  args: {
    disabled: false,
    orientation: 'horizontal',
    groups: threeGroups,
    items: fruitItems,
    defaultValue: {
      shortlist: ['banana', 'fig'],
      selected: ['mango', 'pear'],
    },
  },
};

const userItems = [
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
    orientation: 'horizontal',
    groups: [
      { key: 'users', title: 'Users' },
      { key: 'invited', title: 'Invited' },
    ],
    items: userItems,
    defaultValue: { invited: ['bob-b-', 'eve-e-'] },
    searchPlaceholder: 'Search users...',
    renderItem: (item) => (
      <UserOption user={{ name: `${item.label}` }} />
    ),
  },
};

const getFruitValue = (selected: string[]): TransferListValue => ({
  available: fruitItems.map((o) => o.value).filter((v) => !selected.includes(v)),
  selected,
});

export const Controlled: Story = {
  name: 'Controlled',
  args: {
    disabled: false,
    orientation: 'horizontal',
  },
  render: (args) => (
    <ControlledStory<TransferListValue, TransferListProps>
      component={TransferList}
      props={{ ...args, groups: twoGroups, items: fruitItems }}
      initialValue={getFruitValue(['cherry', 'kiwi', 'papaya'])}
      actions={[
        { label: 'Move Cherry, Kiwi, Papaya to Selected', value: getFruitValue(['cherry', 'kiwi', 'papaya']) },
        { label: 'Move All to Available', value: getFruitValue([]) },
      ]}
    />
  ),
};
