import type { Meta, StoryObj } from '@storybook/react';
import {
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';

import { ElementIntent } from '../../types';
import { Button } from '../Button';
import { Menu, MenuProps } from './Menu';
import {
  Action,
  MenuGroup,
  MenuItem,
} from './Menu.types';

type StoryArgs = MenuProps & {
  icons: boolean;
  groups: boolean;
};

const meta: Meta<StoryArgs> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { table: { disable: true } },
    items: { table: { disable: true } },
    mobile: {
      control: 'boolean',
      description: 'Renders a bottom drawer instead of an anchored popover.',
      table: { category: 'Behavior' },
    },
    icons: {
      control: 'boolean',
      description: 'Pass icons to menu items.',
      table: { category: 'Items' },
    },
    groups: {
      control: 'boolean',
      description: 'Split items into multiple groups.',
      table: { category: 'Items' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const trigger = <Button icon={<MoreHorizontal />} />;

const createItems = (config: { icons: boolean; groups: boolean; }): (MenuItem | MenuGroup)[] => {

  const groupA: Action[] = [
    { handler: () => { }, label: 'Edit', icon: <Pencil /> },
    { handler: () => { }, label: 'Add', icon: <Plus /> },
    { handler: () => { }, label: 'Settings', icon: <Settings /> },
  ];

  const groupB: Action[] = [
    { handler: () => { }, label: 'Delete', icon: <Trash2 />, intent: 'danger' as ElementIntent },
  ];

  const iconMapper = ({ icon, ...item }: Action): Action => ({
    ...item,
    icon: config.icons ? icon : undefined,
  });

  return config.groups ? [
    { items: groupA.map(iconMapper) },
    { items: groupB.map(iconMapper) },
  ] : [
    ...groupA,
    ...groupB,
  ].map(iconMapper);
};

export const Desktop: Story = {
  args: {
    mobile: false,
    icons: true,
    groups: false,
  },
  render: ({ mobile, ...args }) => (
    <Menu mobile={mobile} items={createItems(args)}>
      {trigger}
    </Menu>
  ),
};

export const Mobile: Story = {
  args: {
    mobile: true,
    icons: false,
    groups: true,
  },
  render: ({ mobile, ...args }) => (
    <Menu mobile={mobile} items={createItems(args)}>
      {trigger}
    </Menu>
  ),
};
