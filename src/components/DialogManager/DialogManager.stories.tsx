import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { longContent } from '../../fixtures';
import { Button } from '../Button';
import { DialogContext } from './Dialog.context';
import { DialogManager } from './DialogManager';
import { useDialogManager } from './DialogManager.hooks';

interface StoryArgs {
  title: string;
  content: string;
  maxWidth?: string | number;
  preventCancel?: boolean;
  disablePadding?: boolean;
}

const BasicDialogWrapper = (args: StoryArgs): JSX.Element => {
  const { open } = useDialogManager();
  return (
    <Button text="Click Me" onClick={() => open(args)} />
  );
};

const NestedConfirmationStory = (args: StoryArgs): JSX.Element => {
  const { open, close } = useDialogManager();
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

const DirtyConfirmationStory = (args: StoryArgs): JSX.Element => {
  const { open, close } = useDialogManager();
  const [id, setId] = useState<string>('');
  const handleClick = (): void => {
    setId(open({
      ...args,
      renderContent: (props: DialogContext) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'start' }}>
          <span>This dialog is currently: <strong>{props.dirty ? 'dirty' : 'clean'}</strong>.</span>
          <Button text={props.dirty ? 'Set Clean' : 'Set Dirty'} onClick={() => props.setDirty(!props.dirty)} />
          <span>You can also set it programmatically with the useDialog hook.</span>
        </div>
      ),
      onCancel: (dirty) => dirty ? open({
        title: 'Discard Changes?',
        content: 'This cannot be undone.',
        actions: [
          {
            text: 'Confirm',
            intent: 'danger',
            onClick: () => close(id),
          },
        ],
      }) : close(id),
      actions: [
        {
          text: 'Save',
          intent: 'neutral',
          onClick: () => close(id),
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
    maxWidth: {
      control: 'number',
      description: 'The maximum width of the dialog in pixels.',
      table: { category: 'Appearance' },
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
    maxWidth: 480,
    preventCancel: false,
    disablePadding: false,
  },
  render: (args) => (
    <DialogManager>
      <BasicDialogWrapper {...args} />
    </DialogManager>
  ),
};

export const PreventCancel: Story = {
  name: 'Prevent Cancel',
  args: {
    title: 'Dialog Without Cancel',
    content: 'This dialog cannot be cancelled by clicking outside or the X button. You must use one of the action buttons to close it.',
    maxWidth: 480,
    preventCancel: true,
    disablePadding: false,
  },
  render: (args) => (
    <DialogManager>
      <BasicDialogWrapper {...args} />
    </DialogManager>
  ),
};

export const NestedConfirmation: Story = {
  name: 'Nested Confirmation',
  args: {
    title: 'Root Dialog',
    content: 'This dialog will span a nested dialog when you click "Delete".',
    maxWidth: 480,
    preventCancel: false,
    disablePadding: false,
  },
  render: (args) => (
    <DialogManager>
      <NestedConfirmationStory {...args} />
    </DialogManager>
  ),
};

export const DirtyConfirmation: Story = {
  name: 'Dirty Confirmation',
  args: {
    title: 'Root Dialog',
    content: 'This dialog will span a nested dialog when you click "Delete".',
    maxWidth: 480,
    disablePadding: false,
  },
  render: (args) => (
    <DialogManager>
      <DirtyConfirmationStory {...args} />
    </DialogManager>
  ),
};

export const LongContent: Story = {
  name: 'Long Content',
  args: {
    title: 'Long Content',
    maxWidth: 480,
    content: longContent,
    preventCancel: false,
    disablePadding: false,
  },
  render: (args) => (
    <DialogManager>
      <BasicDialogWrapper {...args} />
    </DialogManager>
  ),
};
