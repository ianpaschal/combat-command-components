import type { Meta, StoryObj } from '@storybook/react';

import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // className: { table: { disable: true } },
    placeholder: {
      control: 'text',
      description: 'A placeholder for when value is undefined.',
    },
    // icon: {
    //   control: false,
    //   table: { disable: true },
    // },
    // iconPosition: {
    //   control: 'radio',
    //   options: ['start', 'end'],
    //   description: 'The position of the icon relative to the text.',
    //   table: { category: 'Content' },
    // },
    // variant: {
    //   control: 'select',
    //   options: ['primary', 'secondary', 'outlined', 'ghost'],
    //   description: 'The variant of the button.',
    //   table: { category: 'Appearance' },
    // },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple selections.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Select>;

const items = {
  apple: 'Apple',
  banana: 'Banana',
  blackberry: 'Blackberry',
  blueberry: 'Blueberry',
  grape: 'Grape',
  kiwi: 'Kiwi',
  mango: 'Mango',
  orange: 'Orange',
  peach: 'Peach',
  pear: 'Pear',
  pineapple: 'Pineapple',
  plum: 'Plum',
  raspberry: 'Raspberry',
  strawberry: 'Strawberry',
  watermelon: 'Watermelon',
};

export const Default: Story = {
  args: {
    items,
  },
};
