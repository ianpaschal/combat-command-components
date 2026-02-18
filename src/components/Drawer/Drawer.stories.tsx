import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { longContent } from '../../fixtures';
import { Button } from '../Button';
import { Drawer, DrawerProps } from './Drawer';
import { useDrawer } from './Drawer.hooks';

const meta: Meta<DrawerProps> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
    onClose: { table: { disable: true } },
    onOpenChangeComplete: { table: { disable: true } },
    open: { table: { disable: true } },
    trigger: { table: { disable: true } },
    title: {
      control: 'text',
      description: 'The title displayed in the drawer header.',
      table: { category: 'Content' },
    },
    disablePadding: {
      control: 'boolean',
      description: 'Whether to disable horizontal padding on the content area.',
      table: { category: 'Appearance' },
    },
    maxSize: {
      control: 'number',
      description: 'Maximum size of the drawer (width for left/right, height for top/bottom).',
      table: { category: 'Appearance' },
    },
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Which edge the drawer anchors to.',
      table: { category: 'Behavior' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ControlledStory = (args: DrawerProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button text="Open Drawer" onClick={() => setOpen(true)} />
      <Drawer
        {...args}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export const Uncontrolled: Story = {
  name: 'Uncontrolled',
  args: {
    title: 'Drawer Title',
    children: 'This drawer manages its own open state via the trigger prop.',
    side: 'right',
    disablePadding: false,
  },
  render: (args) => (
    <Drawer
      {...args}
      trigger={<Button text="Open Drawer" />}
    />
  ),
};

export const RightSideControlled: Story = {
  name: 'Right (Controlled)',
  args: {
    title: 'Right Drawer',
    children: 'This drawer slides in from the right and can be swiped right to dismiss.',
    side: 'right',
    disablePadding: false,
    open: false,
  },
  render: (args) => <ControlledStory {...args} />,
};

const ProgrammaticCloseContent = (): JSX.Element => {
  const { close } = useDrawer();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'start' }}>
      <span>This drawer can be closed programmatically using the useDrawer hook.</span>
      <Button text="Close Drawer" onClick={close} />
    </div>
  );
};

export const ProgrammaticClose: Story = {
  name: 'Programmatic Close',
  args: {
    title: 'Drawer with Close Button',
    side: 'right',
    disablePadding: false,
  },
  render: (args) => (
    <Drawer
      {...args}
      trigger={<Button text="Open Drawer" />}
    >
      <ProgrammaticCloseContent />
    </Drawer>
  ),
};

export const LongContent: Story = {
  name: 'Long Content',
  args: {
    title: 'Long Content',
    children: longContent,
    side: 'bottom',
    disablePadding: false,
  },
  render: (args) => (
    <Drawer {...args} trigger={<Button text="Open Drawer" />} />
  ),
};

export const MaxSize: Story = {
  name: 'Max Size',
  args: {
    title: 'Capped Drawer',
    children: longContent,
    side: 'right',
    maxSize: 480,
    disablePadding: false,
  },
  render: (args) => (
    <Drawer {...args} trigger={<Button text="Open Drawer" />} />
  ),
};
