import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { DialogProvider } from './DialogProvider';
import { useDialogManager } from './DialogProvider.hooks';

interface StoryArgs {
  title: string;
  content: string;
  preventCancel?: boolean;
  disablePadding?: boolean;
}

const BasicDialogWrapper = (args: StoryArgs): JSX.Element => {
  const { open } = useDialogManager();
  return (
    <Button text="Click Me" onClick={() => open(args)} />
  );
};

const NestedDialogStory = (args: StoryArgs): JSX.Element => {
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
    content: 'This dialog will span a nested dialog when you click "Delete".',
    preventCancel: false,
    disablePadding: false,
  },
  render: (args) => (
    <DialogProvider>
      <NestedDialogStory {...args} />
    </DialogProvider>
  ),
};

export const LongContent: Story = {
  name: 'Long Content',
  args: {
    title: 'Long Content',
    content: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sollicitudin ligula nisi, 
      eget eleifend ex rutrum nec. Phasellus velit enim, aliquam quis semper at, dapibus at libero. 
      Duis in congue mi, vitae ultricies velit. In euismod tincidunt vulputate. Aliquam iaculis orci 
      vel finibus tristique. Fusce laoreet ante ligula, vitae tristique elit ultricies id. In eu 
      odio sit amet nulla feugiat pharetra. Phasellus nec elit urna. Suspendisse dolor metus, 
      imperdiet vitae placerat vitae, luctus eget tellus. Aenean efficitur enim ut neque viverra 
      sodales. Sed ac sem non urna feugiat elementum at eget ligula. Pellentesque nibh arcu, aliquam 
      ac iaculis quis, sodales id tellus. Cras at mauris nisl. Morbi erat justo, consectetur at 
      tellus sit amet, lobortis tristique nibh. In vel massa ultricies orci malesuada ornare at at 
      magna. Ut facilisis dapibus metus nec sodales.

      Donec commodo nisl tellus, eu feugiat mauris sollicitudin sed. Suspendisse potenti. Ut 
      convallis cursus neque, ac luctus nisi blandit at. Ut feugiat tellus eu arcu eleifend, 
      ultricies tincidunt lectus tincidunt. Donec blandit fringilla magna in hendrerit. Donec 
      porttitor id diam id varius. Fusce aliquam mi sapien, ac tempor neque consectetur non. 
      Phasellus laoreet aliquam nulla pharetra egestas. Aliquam et odio ac leo dictum tincidunt. 
      Etiam sit amet mattis libero. Nam eu tempus dui, vel condimentum dolor. In elementum ex neque. 
      Phasellus lacinia, neque nec suscipit posuere, felis nisl hendrerit ex, a euismod nunc ligula 
      in sem.

      Sed id mauris nunc. Etiam rutrum eros velit, sit amet maximus magna pharetra nec. Vestibulum 
      consequat tempus lorem, id cursus mauris tristique eu. Sed bibendum ultrices velit, vitae 
      mattis leo convallis in. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque 
      dignissim, ante in dictum lacinia, ipsum turpis rutrum eros, id rhoncus ante nulla nec purus. 
      Phasellus varius odio nibh, id facilisis erat laoreet non. Curabitur ac mauris quis leo 
      egestas elementum vel vitae odio. Morbi sit amet suscipit felis.

      Nulla at diam elementum, consectetur sapien eget, fringilla neque. Donec pharetra leo auctor, 
      laoreet elit et, ultrices velit. Vestibulum in lorem ac arcu placerat pulvinar vitae sit amet 
      nisl. Nulla mi metus, viverra quis ex non, convallis luctus magna. Duis facilisis efficitur 
      tortor ut egestas. Quisque ultricies purus in elit placerat accumsan. Nulla vel massa iaculis, 
      imperdiet nibh ut, convallis orci. Quisque interdum consequat neque, sed ullamcorper velit 
      dapibus at. Phasellus lobortis gravida condimentum. Aliquam erat volutpat.

      Pellentesque quis leo eu dui placerat dignissim in sit amet risus. Quisque pulvinar venenatis 
      ligula, ut efficitur mi elementum vel. Morbi condimentum at justo non congue. In tincidunt, 
      odio in luctus semper, libero velit facilisis nisi, a feugiat lacus sem id dolor. Cras non 
      lacus eget velit hendrerit consequat et a sem. Quisque at nulla in ligula accumsan finibus et 
      et risus. Pellentesque rutrum, elit eget interdum ornare, dui libero porta purus, non dictum 
      augue ante at dui. Etiam faucibus nulla nec orci luctus, pulvinar eleifend sapien feugiat. 
      Proin sodales mi eu tellus lacinia, eget varius tortor sagittis. Maecenas porta lacus ut 
      tortor volutpat tincidunt. Nulla nulla risus, laoreet a lacus ut, euismod consectetur lorem. 
      Suspendisse ut bibendum magna, sit amet bibendum augue.
    `,
    preventCancel: false,
    disablePadding: false,
  },
  render: (args) => (
    <DialogProvider>
      <NestedDialogStory {...args} />
    </DialogProvider>
  ),
};
