import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { DialogProvider } from './DialogProvider';
import { useDialogs } from './DialogProvider.hooks';

interface StoryArgs {
  title: string;
  content: string;
  preventCancel?: boolean;
  disablePadding?: boolean;
}

const BasicDialogWrapper = (args: StoryArgs): JSX.Element => {
  const { open } = useDialogs();
  return (
    <Button text="Click Me" onClick={() => open(args)} />
  );
};

const NestedDialogStory = (args: StoryArgs): JSX.Element => {
  const { open, close } = useDialogs();
  const [id, setId] = useState<string>('');
  const handleClick = (): void => {
    setId(open({
      ...args,
      actions: [
        {
          text: 'Delete',
          intent: 'danger',
          onClick: () => open({
            title: 'Are you sure?',
            content: 'This cannot be undone.',
            actions: [
              {
                text: 'Confirm',
                intent: 'danger',
                onClick: () => close(id),
              },
            ],
          }),
        },
      ],
    }));
  };
  return (
    <Button text="Click Me" onClick={handleClick} />
  );
};

const meta: Meta<StoryArgs> = {
  title: 'Components/Dialog',
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
  render: (args) => (
    <DialogProvider>
      <BasicDialogWrapper {...args} />
    </DialogProvider>
  ),
};

export const PreventCancel: Story = {
  name: 'Prevent Cancel',
  args: {
    title: 'Dialog Without Cancel',
    content: 'This dialog cannot be cancelled by clicking outside or the X button. You must use one of the action buttons to close it.',
    preventCancel: true,
    disablePadding: false,
  },
  render: (args) => (
    <DialogProvider>
      <BasicDialogWrapper {...args} />
    </DialogProvider>
  ),
};

export const NestedConfirmation: Story = {
  name: 'Nested Confirmation',
  args: {
    title: 'Root Dialog',
    content: 'This dialog will span a nested dialog when you click "Delete"',
    preventCancel: false,
    disablePadding: false,
  },
  render: (args) => (
    <DialogProvider>
      <NestedDialogStory {...args} />
    </DialogProvider>
  ),
};
