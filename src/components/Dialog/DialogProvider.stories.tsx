import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import {
  closeDialog,
  DialogProvider,
  openDialog,
} from './';

interface StoryArgs {
  title: string;
  content: string;
  preventCancel?: boolean;
  disablePadding?: boolean;
}

const BasicDialogWrapper = (args: StoryArgs): JSX.Element => (
  <>
    <Button text="Click Me" onClick={() => openDialog(args)} />
    <DialogProvider />
  </>
);

const NestedDialogWrapper = (args: StoryArgs): JSX.Element => {
  const [id, setId] = useState<string>('');
  const handleClick = (): void => {
    setId(openDialog({
      ...args,
      actions: [
        {
          text: 'Delete',
          intent: 'danger',
          onClick: () => openDialog({
            title: 'Are you sure?',
            content: 'This cannot be undone.',
            actions: [
              {
                text: 'Confirm',
                intent: 'danger',
                onClick: () => closeDialog(id),
              },
            ],
          }),
        },
      ],
    }));
  };
  return (
    <>
      <Button text="Click Me" onClick={handleClick} />
      <DialogProvider />
    </>
  );
};

const meta: Meta<StoryArgs> = {
  title: 'Components/Dialog',
  component: DialogProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the dialog.',
      table: { category: 'Content' },
    },
    content: {
      control: 'text',
      description: 'The content of the dialog.',
      table: { category: 'Content' },
    },
    preventCancel: {
      control: 'boolean',
      description: 'Whether the dialog can be cancelled by clicking outside or the X button.',
      table: { category: 'Behavior' },
    },
    disablePadding: {
      control: 'boolean',
      description: 'Whether to disable padding on the dialog content area.',
      table: { category: 'Appearance' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    title: 'Example Dialog',
    content: 'This is a default dialog with no custom actions. You can close it by clicking the X button, clicking outside, or using the default action buttons.',
    preventCancel: false,
    disablePadding: false,
  },
  render: (args) => <BasicDialogWrapper {...args} />,
};

export const PreventCancel: Story = {
  name: 'Prevent Cancel',
  args: {
    title: 'Dialog Without Cancel',
    content: 'This dialog cannot be cancelled by clicking outside or the X button. You must use one of the action buttons to close it.',
    preventCancel: true,
    disablePadding: false,
  },
  render: (args) => <BasicDialogWrapper {...args} />,
};

export const NestedConfirmation: Story = {
  name: 'Nested Confirmation',
  args: {
    title: 'Root Dialog',
    content: 'This dialog will span a nested dialog when you click "Delete"',
    preventCancel: false,
    disablePadding: false,
  },
  render: (args) => <NestedDialogWrapper {...args} />,
};
