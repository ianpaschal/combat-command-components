import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { longContent } from '../../fixtures';
import { Button } from '../Button';
import { Drawer, DrawerProps } from './Drawer';
import { useDrawer } from './Drawer.hooks';
import { DrawerProvider } from './DrawerProvider';

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
    fullSize: {
      control: 'boolean',
      description: 'Expands the drawer to its maximum size. When false (default), the drawer shrinks to fit its content.',
      table: { category: 'Appearance' },
    },
    maxSize: {
      control: 'number',
      description: 'Caps the maximum size of the drawer (width for left/right, height for top/bottom).',
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

export const FullSize: Story = {
  name: 'Full Size',
  args: {
    title: 'Full Size Drawer',
    children: 'This drawer expands to its maximum size.',
    side: 'bottom',
    fullSize: true,
    disablePadding: false,
  },
  render: (args) => (
    <Drawer {...args} trigger={<Button text="Open Drawer" />} />
  ),
};

const NestedDrawerContent = (): JSX.Element => {
  const [nestedOpen, setNestedOpen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'start' }}>
      <span>This is the first drawer. Open a nested drawer from here.</span>
      <Button text="Open Nested Drawer" onClick={() => setNestedOpen(true)} />
      <Drawer
        title="Nested Drawer"
        open={nestedOpen}
        onClose={() => setNestedOpen(false)}
        side="bottom"
      >
        <span>This is a nested drawer. The parent drawer should be scaled back and overlayed.</span>
      </Drawer>
    </div>
  );
};

export const Nested: Story = {
  name: 'Nested',
  args: {
    title: 'Parent Drawer',
    side: 'bottom',
    disablePadding: false,
  },
  render: (args) => (
    <DrawerProvider>
      <Drawer {...args} trigger={<Button text="Open Drawer" />}>
        <NestedDrawerContent />
      </Drawer>
    </DrawerProvider>
  ),
};
